FROM node:10-jessie

RUN echo "deb http://http.debian.net/debian jessie-backports main" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y -t jessie-backports openjdk-8-jdk

RUN echo "deb [arch=amd64] http://storage.googleapis.com/bazel-apt stable jdk1.8" | tee /etc/apt/sources.list.d/bazel.list && \ 
  curl https://bazel.build/bazel-release.pub.gpg | apt-key add -

RUN apt-get update \
  && apt-get install -y bazel \
  && rm -rf /var/lib/apt/lists/*

RUN npm update && npm install npm
RUN npm install -g lerna typescript

ENV NODE_ENV development
ADD pkg-install.js /usr/bin/pkg-install
WORKDIR /usr/src
