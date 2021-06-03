from multiprocessing import cpu_count
from os import environ

bind = '127.0.0.1:3031'
workers = 5

accesslog = '/var/log/gunicorn/access.log'
errorlog = '/var/log/gunicorn/error.log'

umask = 0o007
