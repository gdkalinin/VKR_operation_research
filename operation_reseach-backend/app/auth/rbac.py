import functools

from flask import jsonify
from flask import request, abort
from . import get_current_user

import functools

from flask import jsonify
from flask import request, abort


from . import get_current_user

#
# def check_roles(*role_codes, check_hierarchy):
#     user = get_current_user()
#     user_role = user.role
#     is_authorized = user_role.code in role_codes
#
#     if not is_authorized and check_hierarchy:
#         for role_code in role_codes:
#             if is_authorized:
#                 break
#             current_role = session.query(Role).filter(Role.code == role_code).first()
#             if not current_role:
#                 continue
#             while current_role.parent_id is not None:
#                 current_role = session.query(Role).filter(Role.id == current_role.parent_id).first()
#                 if not current_role:
#                     break
#                 if current_role.code == user_role.code:
#                     is_authorized = True
#                     break
#
#     if not is_authorized:
#         raise NotAuthorizedException('Неподходящая роль')
#
# def roles_anyof(*role_codes):
#     """ Декоратор для проверки наличия нужной роли у пользователя """
#     def decorator(func):
#         @functools.wraps(func)
#         def wrapper(*args, **kwargs):
#             check_roles(*role_codes)
#             return func(*args, **kwargs)
#         return wrapper
#     return decorator