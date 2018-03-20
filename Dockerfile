FROM node:9.10-slim
LABEL maintainer="developers@erento.com"

COPY . /app

ARG appVersion=latest
ENV APP_VERSION ${appVersion}

USER nobody
WORKDIR /app

CMD ["npm", "run", "start:prod"]
