#!/bin/bash
set -e

if [ "x$APP_ROOT" = x ]
then
    for dir in "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" /app /vagrant
    do
        if [ -d "$dir" ] && [ -d "$dir/slyd" ]
        then
            APP_ROOT="$dir"
            break
        fi
    done
fi

if [ "x$APP_ROOT" = x ]
then
    echo "Could not determine app directory"
    exit 1
fi

echo "APP_ROOT=$APP_ROOT"

usage() {
    cat <<EOF
Portia provisioner.

Usage: $0 COMMAND [ COMMAND ... ]

Available commands:
usage -- print this message
install_deps -- install system-level dependencies
install_splash -- install splash
install_python_deps -- install python-level dependencies
configure_initctl -- installs initctl configuration
configure_nginx -- installs nginx configuration
configure_scrapyd -- installs scrapyd configuration 
configure_slyd -- installs slyd watch script
cleanup -- remove unnecessary files. DON'T RUN UNLESS IT'S INSIDE AN IMAGE AND YOU KNOW WHAT YOU ARE DOING

EOF
}

export SPLASH_PYTHON_VERSION=${SPLASH_PYTHON_VERSION:-"2"}

activate_venv () {
    if [ -e ${VIRTUAL_ENV}/bin/activate ]; then
        echo "Activating virtual env..."
        source ${VIRTUAL_ENV}/bin/activate
    fi
}

install_deps(){
    echo deb http://nginx.org/packages/ubuntu/ trusty nginx > /etc/apt/sources.list.d/nginx.list
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62
    apt-get update 
    apt-get -y install wget 
    wget -O - https://deb.nodesource.com/setup_7.x | bash -
    apt-get update -q
    apt-get -y --no-install-recommends install \
            curl \
            libxml2-dev \
            libxslt-dev \
            libgl1-mesa-dev \
            libgl1-mesa-glx \
            libglapi-mesa \
            libgl1-mesa-dri \
            libmysqlclient-dev \
            nginx python-dev \
            nodejs \
            python-mysql.connector \
            python-numpy \
            python-openssl \
            python-pip \
            python-software-properties \
            mongodb \
            rabbitmq-server \
            git \
            build-essential 
    pip install -U pip setuptools
}

install_python_deps(){
    activate_venv
    pip install -r "$APP_ROOT/slybot/requirements.txt"
    pip install -r "$APP_ROOT/slyd/requirements.txt"
    pip install -r "$APP_ROOT/portia_server/requirements.txt"
    pip install -r "$APP_ROOT/docs/requirements.txt"
    pip install -e "$APP_ROOT/slyd"
    pip install -e "$APP_ROOT/slybot"
}

install_splash(){
    cd /tmp
    curl -L -o splash.tar.gz 'https://github.com/scrapinghub/splash/archive/2.3.x.tar.gz'
    tar -xvf splash.tar.gz --keep-newer-files
    cd splash-*
    activate_venv
    dockerfiles/splash/provision.sh \
        prepare_install \
        install_builddeps \
        install_deps \
        install_pyqt5
    pip install .
}


cleanup() {
    cd /tmp/splash-*
    dockerfiles/splash/provision.sh \
        remove_builddeps \
        remove_extra
    cd /
    rm -rf /tmp/splash*
    rm -rf /var/lib/apt/lists/*
    apt-get remove --purge -y libxml2-dev \
                              libxslt-dev \
                              libgl1-mesa-dev \
                              python-dev
    apt-get autoremove -y
    apt-get clean
    find / | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf
}

configure_nginx(){
    cp -r $APP_ROOT/nginx/* /etc/nginx
    sed 's/\/app\//'""${APP_ROOT//\//\\\/}""'\//g' -i /etc/nginx/nginx.conf
}

configure_scrapyd(){
    if [ ! -d "/etc/scrapyd" ]; then 
        mkdir /etc/scrapyd
    fi
    cp -r $APP_ROOT/scrapyd/scrapyd.conf.template /etc/scrapyd/scrapyd.conf
    sed 's/\/app\//'""${APP_ROOT//\//\\\/}""'\//g' -i /etc/scrapyd/scrapyd.conf
}

configure_initctl(){
    cp "$APP_ROOT/portia.conf" /etc/init
    sed 's/\/app\//'""${APP_ROOT//\//\\\/}""'\//g' -i /etc/init/portia.conf
}

configure_slyd(){
    cp "$APP_ROOT/slyd/do_slyd_start.sh.template" "$APP_ROOT/slyd/do_slyd_start.sh"  
    sed 's/\/app\//'""${APP_ROOT//\//\\\/}""'\//g' -i "$APP_ROOT/slyd/do_slyd_start.sh"
}

migrate_django_db(){
    cd "$APP_ROOT/portia_server"
    python manage.py makemigrations portia_dashboard
    python manage.py migrate
}

start_portia(){
    echo "Starting Nginx"
    echo "=============="
    /etc/init.d/nginx start
    echo "Starting Nginx"
    echo "=============="
    start portia
}

install_frontend_deps() {
    npm install -g bower ember-cli
}

build_assets() {
    cd "$APP_ROOT/portiaui"
    npm install && bower install --allow-root 
    ember build
}

build_docs() {
    cd "$APP_ROOT/docs"
    make html
}

if [ \( $# -eq 0 \) -o \( "$1" = "-h" \) -o \( "$1" = "--help" \) ]; then
    usage
    exit 1
fi

UNKNOWN=0
for cmd in "$@"; do
    if [ "$(type -t -- "$cmd")" != "function" ]; then
        echo "Unknown command: $cmd"
        UNKNOWN=1
    fi
done

if [ $UNKNOWN -eq 1 ]; then
    echo "Unknown commands encountered, exiting..."
    exit 1
fi

while [ $# -gt 0 ]; do
    echo "Executing command: $1"
    "$1"
    shift
done

