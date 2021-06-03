import os

PROJ_NAME = 'operation_research'
PROJ_VERSION = '1.0.0'

# APP
SECRET_KEY = os.getenv('APP_SECRET_KEY', 'GwCKr515KQC4x5OBtaWp')
JWT_SECRET_KEY = os.getenv("APP_JWT_SECRET_KEY", "SOME_JWT_SECRET_KEY")
LOG_FILE_PATH = os.getenv('APP_LOG_FILE_PATH', '../log/logfile.log')
URL_PREFIX = '/service'
SECRET_LOGIN_KEY = os.getenv(
    "APP_SECRET_LOGIN_KEY", "EjET7CjWipsVuF-p0n7zmKmTOjX2w8GUuJYYY4DCUIY="
)
JWT_ACCESS_TOKEN_EXPIRES_MINUTES = int(
    os.getenv("APP_JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60 * 24 * 14)
)
# DB SETTINGS
DB_HOST = os.getenv('APP_DB_HOST', '180.25.0.11')
DB_NAME = os.getenv('APP_DB_NAME', 'ord')
DB_TYPE = os.getenv('APP_DB_TYPE', 'postgresql')
DB_USER = os.getenv('APP_DB_USER', 'ord')
DB_PASSWORD = os.getenv('APP_DB_PASSWORD', 'qkWZeZ1v')

try:
    from .config_local import *
except ImportError:
    pass


SQLALCHEMY_DATABASE_URI = '{db_type}://{db_user}:{db_password}@{db_host}/{db_name}'.format(db_user=DB_USER,
                                                                                           db_password=DB_PASSWORD,
                                                                                           db_host=DB_HOST,
                                                                                           db_name=DB_NAME,
                                                                                           db_type=DB_TYPE)
