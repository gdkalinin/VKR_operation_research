import datetime

from flask_sqlalchemy import SQLAlchemy
from copy import deepcopy

from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(255), index=True, unique=True)
    password = db.Column(db.String(128))
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    permission_id = db.Column(db.Integer, db.ForeignKey("permissions.id"))
    is_active = db.Column(db.Boolean, default=True)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"))

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __eq__(self, other):
        if isinstance(other, User):
            return self.get_id() == other.get_id()
        return NotImplemented

    def __ne__(self, other):
        equal = self.__eq__(other)
        if equal is NotImplemented:
            return NotImplemented
        return not equal


class Permission(db.Model):
    __tablename__ = "permissions"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), unique=True)


class Group(db.Model):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), unique=True)


class Test(db.Model):
    __tablename__ = "tests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    finish_until = db.Column(db.TIMESTAMP)
    start_at = db.Column(db.TIMESTAMP)
    description = db.Column(db.VARCHAR(255))
    is_rating = db.Column(db.Boolean, default=False)


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey("tests.id"))
    condition = db.Column(JSONB)
    solution = db.Column(JSONB)
    student_solution = db.Column(JSONB)
    solved = db.Column(db.Boolean, default=False)
    weight = db.Column(db.Integer, default=1)
    task_type = db.Column(db.Integer, db.ForeignKey("task_types.id"))


class TaskType(db.Model):
    __tablename__ = "task_types"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), unique=True)


class Mark(db.Model):
    __tablename__ = "marks"
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey("tests.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    mark = db.Column(db.Integer)
    comment = db.Column(db.String(255))


class Presentation(db.Model):
    __tablename__ = "presentation"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    access = db.Column(ARRAY(db.Integer))


class PresentationSlide(db.Model):
    __tablename__ = "presentation_slides"
    id = db.Column(db.Integer, primary_key=True)

    presentation_id = db.Column(db.Integer, db.ForeignKey("presentations.id"))
    name = db.Column(db.String(255))
    index = db.Column(db.Integer)
    image_src = db.Column(db.String(255))
    audio_src = db.Column(db.String(255))
    hidden = db.Column(db.Boolean, default=False)
