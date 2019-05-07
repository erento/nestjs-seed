FROM node:11.15-alpine
LABEL maintainer="developers@erento.com"

COPY . /app
WORKDIR /app

RUN rm -rf src

ARG appVersion=latest
ENV APP_VERSION ${appVersion}

USER nobody

CMD ["npm", "run", "start:prod"]
