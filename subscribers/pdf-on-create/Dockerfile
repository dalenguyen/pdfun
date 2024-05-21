FROM node:20-slim

RUN set -ex; \
  apt-get -y update; \
  apt-get -y install ghostscript; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . ./

RUN yarn --pure-lockfile --non-interactive

CMD ["node", "main.js"]
