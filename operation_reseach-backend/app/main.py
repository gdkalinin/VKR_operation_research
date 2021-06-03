import base64
from datetime import date
from os import listdir
from os.path import isfile, join

import jwt
from flask import Flask, jsonify, request, abort
from flask.json import JSONEncoder
from flask_jwt_extended import create_access_token, get_jwt_claims, get_jwt_identity
from flask_jwt_extended.jwt_manager import JWTManager
from flask_jwt_extended.view_decorators import jwt_required
from flask_rest_api import Blueprint
from sqlalchemy import or_, and_
from sqlalchemy.exc import IntegrityError

from auth.schemas.models import SuccessJsonSchema, SuccessSchema
import instance.config
from flask_cors import CORS

from auth.schemas.arguments import CreateUserArgsSchema, CreateTestSchema
from service.database import db, User, Group, Permission, Presentation, Test, Task
import time
from app.instance.config import (
    SECRET_LOGIN_KEY
)
from cryptography.fernet import Fernet

import io
from base64 import encodebytes
from PIL import Image
from flask import jsonify
from service.simplex import simplex_task, Simplex

resource = Blueprint(
    "Authorization", "Authorization", description="operations on authorization"
)


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.strftime("%Y-%m-%d")
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)


app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
app.config["SQLALCHEMY_DATABASE_URI"] = instance.config.SQLALCHEMY_DATABASE_URI
app.config["JWT_SECRET_KEY"] = instance.config.JWT_SECRET_KEY

with app.app_context():
    app.app_config = instance.config
    db.init_app(app)
    JWTManager(app)
    CORS(app, supports_credentials="*")


def db_commit():
    try:
        db.session.commit()
    except IntegrityError as ie:
        db.session.rollback()
        abort(400, message=ie.orig.pgerror)
    except Exception as e:
        db.session.rollback()
        raise e


@app.route("/healthcheck".format(app.app_config.URL_PREFIX), methods=["GET"])
def health_check():
    return "OK"


@app.route("/api/auth/login", methods=["POST"])
def post_login():
    params = request.get_json()
    if not ("email" in params and "password" in params):
        return abort(400, "Не передан логин/пароль")

    login = params["email"].lower()
    password = params["password"]
    user = User.query.filter((User.login == login)).first()

    if user is None:
        return abort(400, "Неверный логин/пароль")
    if not user.check_password(password):
        return abort(400, "Неверный логин/пароль")
    user_serialized = {
        "firstname": user.firstname,
        "lastname": user.lastname,
        "permissions_id": user.permission_id,
        "is_active": user.is_active,
        "id": user.id,
        "group_id": user.group_id,
        "email": user.login,
    }
    # Generate JWT
    try:
        access_token = create_access_token(identity=user_serialized)
    except Exception as e:
        return abort(400)

    serialized_user = {
        "access_token": access_token,
        "status": "ok",
        "user": user_serialized
    }
    return jsonify(serialized_user), 200


@app.route("/api/auth/tlogin", methods=["POST"])
def login_by_token():
    f = Fernet(SECRET_LOGIN_KEY)
    params = request.get_json()

    if "token" not in params:
        return abort(400, "Не передан токен")

    try:
        token = params["token"].encode("utf-8")
        decrypt_token = f.decrypt(token).decode("utf-8")
        login, ip = decrypt_token.split(",")
        timestamp = f.extract_timestamp(token)
    except Exception as e:
        return abort(400, "Не валидный токен")

    real_ip = request.environ.get("HTTP_X_REAL_IP", request.remote_addr)
    if real_ip != ip:
        return abort(400, "Не корректный токен")

    if time.time() - timestamp > 60:
        return abort(400, "Истек срок действия токена")

    user = User.query.filter((User.email == login)).first()

    # Generate JWT
    access_token = create_access_token(identity=user)

    serialized_user = {
        "access_token": access_token,
        "status": "ok",
        "user": {
            "name": user.firstname,
            "second name": user.lastname,
            "permissions": user.permission_id,
            "active": user.is_active,
            "id": user.id,
            "group": user.group_id,
            "email": user.email,
        },
    }

    return jsonify(serialized_user), 200


@app.route("/api/auth/users_search", methods=["GET"])
@jwt_required
@resource.response(SuccessJsonSchema)
def get_users_search():
    """Возвращает количество активированных пользователей"""
    users = db.session.query(
        User.firstname, User.lastname, User.permission_id, User.is_active, User.id, User.group_id, User.login
    )

    users = [
        {
            "name": user.firstname,
            "second_name": user.lastname,
            "permissions": user.permission_id,
            "active": user.is_active,
            "id": user.id,
            "group": user.group_id,
            "email": user.login,
        }
        for user in users
    ]
    return {"status": "ok", "data": users}


@resource.route('/api/admin/user/<int:user_id>', methods=['DELETE'])
@jwt_required
@resource.response(SuccessSchema, code=200)
# @roles_anyof('superusers')
def delete_user(user_id):
    user = db.session.query(User).filter(User.id == user_id).first()
    if not user:
        return abort(404)

    db.session.delete(user)
    db.db_commit()

    return {'status': 'success'}


@app.route('/api/admin/user', methods=['POST'])
@jwt_required
@resource.arguments(CreateUserArgsSchema)
@resource.response(SuccessSchema, code=200)
# @roles_anyof('superusers')
def create_user(args):
    if db.session.query(User).filter(User.login == args['login']).first():
        return abort(400, 'Уже существует аккаунт с таким email')

    if not db.session.query(Permission).filter(Permission.id == args['permission_id']).first():
        return abort(400, 'Отсутствует такая роль')

    new = User(**args)
    new.set_password(args['password'])
    db.session.add(new)

    db_commit()

    return {'data': new.id}


@app.route('/api/tests', methods=['POST'])
@jwt_required
@resource.arguments(CreateTestSchema)
# @roles_anyof('superusers')
def create_tests(args):
    users = db.session.query(User.id).filter(User.group_id == args['assignee']).all()
    tasks = args['tasks']
    for user in users:
        test = Test(user_id=user.id, finish_until=args['finish_until'], start_at=args['start_at'],
                    description=args['description'], is_rating=args['is_rating'])
        db.session.add(test)
        db_commit()
        for key in tasks:
            if key == 'simplex':
                for i in range(int(tasks[key])):
                    task = []
                    result = simplex_task(task)
                    S = Simplex(task, 0)
                    S.simple(task, result)
                    final = S.calculate()
                    result_sum = 0
                    for j in range(len(final)):
                        result_sum += (-1) * task[len(task) - 1][j + 1] * float(final[j])
                    final.append(result_sum)
                    task = Task(test_id=test.id, task_type=1, condition=task, solution=final, student_solution={})
                    db.session.add(task)
                    db_commit()
    return {'result': 200}


@app.route("/api/groups", methods=["GET"])
@jwt_required
@resource.response(SuccessJsonSchema)
def get_groups_search():
    """Возвращает список созданных групп"""
    groups = db.session.query(
        Group.id, Group.description
    )

    groups = [
        {
            "id": group.id,
            "description": group.description
        }
        for group in groups
    ]
    return {"status": "ok", "data": groups}


@app.route("/api/test/<int:test_id>", methods=["GET"])
@jwt_required
@resource.response(SuccessJsonSchema)
def get_test_search(test_id):
    """Возвращает тест по id"""
    test = db.session.query(
        Test.is_rating, Test.description, Test.finish_until, Test.start_at, Test.id
    ).filter(Test.id == test_id).first()
    tasks = db.session.query(Task.id, Task.student_solution, Task.condition, Task.task_type).filter(Task.test_id == test.id).all()
    test = {
            "rating": test.is_rating,
            "description": test.description,
            "finish_until": test.finish_until,
            "start_at": test.start_at,
            "tasks": tasks
        }
    return {"status": "ok", "data": test}


@app.route("/api/presentation", methods=["GET"])
@jwt_required
def get_presentations_search():
    """Возвращает список доступных презентаций"""
    group = int(get_jwt_identity()['group_id'])

    presentations = db.session.query(
        Presentation.id, Presentation.name
    ).filter(or_(Presentation.access == {}, Presentation.access.contains([group]))).all()

    presentations = [
        {
            "id": presentation.id,
            "name": presentation.name
        }
        for presentation in presentations
    ]
    return {"status": "ok", "data": presentations}


@app.route("/api/tests", methods=["GET"])
@jwt_required
def get_tests_search():
    """Возвращает список доступных тестов"""
    permission = int(get_jwt_identity()['permissions_id'])
    user_id = int(get_jwt_identity()['id'])

    tests = [
        {
            "id": t.id,
            "description": t.description,
            'start_date': t.start_at,
            'finish_until': t.finish_until,
            'rating': t.is_rating,
            "assignee": u.firstname + ' ' + u.lastname

        }
        for t, u in
        db.session.query(Test, User).filter(and_(or_(and_(permission != 1, Test.is_rating), user_id == User.id)),
                                            User.id == Test.user_id).all()
    ]
    return {"status": "ok", "data": tests}


def get_images_from_local_storage():
    onlyfiles = [f for f in listdir('reusable/presantation_1_slides/') if
                 isfile(join('reusable/presantation_1_slides/', f))]
    return onlyfiles


def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r')  # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG')  # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii')  # encode as base64
    return encoded_img


def get_response_mp3(mp3_path):
    with open(mp3_path, 'rb') as f:
        b = f.read()
    f.close()
    b64_data = base64.b64encode(b)
    return b64_data


@app.route('/get_images', methods=['GET'])
def get_images():
    try:
        result = get_images_from_local_storage()
        encoded_images = {}
        for image_path in result:
            encoded_images[image_path] = (get_response_image('../app/reusable/presantation_1_slides/' + image_path))
        return jsonify({'result': encoded_images})
    except Exception as e:
        return {"status": str(e)}


def get_audio_from_local_storage():
    array = ['../app/reusable/presantation_1_audio/1.mp3', '../app/reusable/presantation_1_audio/2.mp3']
    return array


@app.route('/get_audios', methods=['GET'])
def get_audios():
    try:
        result = get_audio_from_local_storage()
        encoded_audio = []
        for audio_path in result:
            encoded_audio.append(get_response_mp3(audio_path))
        return jsonify({'result': encoded_audio})
    except Exception as e:
        return {"status": str(e)}


@app.route("/api/auth/logout", methods=["GET"])
@jwt_required
def get_logout():
    # If it is necessary, we can store black list of JWT
    # and put there token of the current user.

    return jsonify({"status": "ok"}), 200


@app.errorhandler(401)
def not_authorizing(e):
    return jsonify({"status": e.description}), 401


if __name__ == "__main__":
    app.run(host="0.0.0.0")
