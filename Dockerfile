ARG UBUNTU_VERSION=20.04
ARG RUBY_VERSION=2.7.0
ARG RUBY_BUNDLER=2.1.2

FROM ubuntu:${UBUNTU_VERSION}

ARG RUBY_VERSION
ARG RUBY_BUNDLER

RUN apt update && apt-get install openssl curl -y 
RUN curl -L https://get.rvm.io | bash -s stable

RUN /bin/bash -l -c "rvm requirements"
RUN /bin/bash -l -c "rvm install $RUBY_VERSION"
RUN /bin/bash -l -c "gem install bundler:$RUBY_BUNDLER"