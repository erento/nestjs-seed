FROM node:20.10-slim
LABEL maintainer="developers@erento.com"

COPY . /app
WORKDIR /app

RUN rm -rf src

ARG appVersion=latest
ENV APP_VERSION ${appVersion}

CMD ["node", "dist/src/main.js"]
