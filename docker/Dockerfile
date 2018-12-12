FROM node:10-jessie as base
RUN npm update && npm install npm
RUN npm install -g lerna typescript
WORKDIR /usr/src

FROM base as builder
COPY ./tools ./tools
RUN cd tools/monorepo && npm install && npm run build

FROM base
ENV NODE_ENV development
COPY --from=builder /usr/src/tools/monorepo/lib/monorepo.js /usr/bin/monorepo