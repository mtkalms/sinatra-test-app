#!/bin/bash
set -e

apt-get -y update
apt-get -y upgrade
apt-get -y install software-properties-common
apt-add-repository -y ppa:rael-gc/rvm
apt-get -y update
apt-get -y install \
    bash-completion \
    git \
    libaio-dev \
    rvm \
    unzip \
    wget

ARCH=$(uname -m)

if [[ "$ARCH" == "x86_64" ]]; then
    wget -o wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-basic-linux.x64-23.8.0.25.04.zip
    wget -a wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-sdk-linux.x64-23.8.0.25.04.zip
    wget -a wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-sqlplus-linux.x64-23.8.0.25.04.zip

    unzip instantclient-basic-linux.x64-*.zip -d /opt/oracle/
    unzip -o instantclient-sdk-linux.x64-*.zip -d /opt/oracle/
    unzip -o instantclient-sqlplus-linux.x64-*.zip -d /opt/oracle/
elif [[ "$ARCH" == "arm*" || "$ARCH" == "aarch64" ]]; then
    wget -o wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-basic-linux.arm64-23.8.0.25.04.zip
    wget -a wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-sdk-linux.arm64-23.8.0.25.04.zip
    wget -a wget.log https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-sqlplus-linux.arm64-23.8.0.25.04.zip

    unzip instantclient-basic-linux.arm64-*.zip -d /opt/oracle/
    unzip -o instantclient-sdk-linux.arm64-*.zip -d /opt/oracle/
    unzip -o instantclient-sqlplus-linux.arm64-*.zip -d /opt/oracle/
fi

rm instantclient-*.zip wget.log

. /usr/share/rvm/scripts/rvm

rvm requirements
rvm install 3.3.6
rvm rvmrc warning ignore /opt/project/Gemfile
gem install bundler -v "2.5.23"
bundle install

rake db:migrate
rake db:dev_data
