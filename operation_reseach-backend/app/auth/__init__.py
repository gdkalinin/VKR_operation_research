from flask_jwt_extended.jwt_manager import JWTManager
from flask_jwt_extended.utils import get_jwt_claims

from main import app
from service.database import User

jwt = JWTManager(app)


@jwt.user_claims_loader
def add_claims_to_access_token(user):
    if user:
        return {
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
    else:
        return {}


@jwt.user_identity_loader
def user_identity_lookup(user):
    if user:
        return user.id
    return 0


def get_current_user():
    user_id = get_jwt_claims().get("user", {}).get("id")
    if not user_id:
        return None

    return User.query.filter(User.id == user_id).first()


