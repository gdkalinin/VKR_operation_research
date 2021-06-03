FROM ubuntu:18.04

ENV APP_DIR /var/www/service
ENV DEBIAN_FRONTEND noninteractive

# Distr update
RUN apt-get update && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

# Set locales
RUN apt-get update && apt-get install -y --no-install-recommends \
    locales \
    && rm -rf /var/lib/apt/lists/*

RUN locale-gen en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8

# Install python
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    && rm -rf /var/lib/apt/lists/*

# Try to update pip
RUN pip3 install --upgrade pip

# Try to install git ssh
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ssh \
    && rm -rf /var/lib/apt/lists/*


# Install NGINX
RUN apt-get update && apt-get install -y --no-install-recommends \
	nginx \
    && rm -rf /var/lib/apt/lists/*

# Make NGINX run on the foreground
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# Copy the modified Nginx conf
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/
COPY deploy/nginx/default /etc/nginx/sites-available/

# Install gunicorn
RUN pip3 install gunicorn
RUN mkdir /var/log/gunicorn
COPY deploy/gunicorn.conf.py /etc/gunicorn/

# Install Supervisord
RUN apt-get update && apt-get install -y --no-install-recommends \
	supervisor \
	&& rm -rf /var/lib/apt/lists/*

# Custom Supervisord config
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# By default, allow unlimited file sizes, modify it to limit the file sizes
# To have a maximum of 1 MB (Nginx's default) change the line to:
# ENV NGINX_MAX_UPLOAD 1m
ENV NGINX_MAX_UPLOAD 0

# By default, Nginx will run a single worker process, setting it to auto
# will create a worker for each CPU core
ENV NGINX_WORKER_PROCESSES 1

# By default, Nginx listens on port 80.
# To modify this, change LISTEN_PORT environment variable.
# (in a Dockerfile or with an option for `docker run`)
ENV LISTEN_PORT 80

COPY deploy/entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]


COPY . $APP_DIR


RUN  apt-get update \
  && apt-get install -y build-essential unzip wget libaio-dev python-dev\
  && rm -rf /var/lib/apt/lists/*


ENV NLS_LANG=RUSSIAN_RUSSIA.CL8MSWIN1251
  
# Install python packages
RUN pip3 install --no-cache-dir -r $APP_DIR/requirements.txt

WORKDIR $APP_DIR
EXPOSE 80
CMD ["/usr/bin/supervisord"]
