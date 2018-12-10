FROM node:10-jessie

RUN npm update && npm install npm
RUN npm install -g lerna typescript

ENV NODE_ENV development
ADD pkg-install.js /usr/bin/pkg-install
WORKDIR /usr/src

#RUN cd /usr/src/tools/monorepo && \
#    npm install && \
#    nexe ./monorepo.js
#