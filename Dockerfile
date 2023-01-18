FROM node:alpine3.17

ENV NODE_VERSION 19.4.0

RUN apk add --no-cache libc6-compat

RUN npm i -g pnpm

WORKDIR /opt/app

ENV NODE_ENV development

COPY package.json pnpm-lock.yaml* ./

RUN pnpm i --frozen-lockfile

COPY . /opt/app

COPY ./docker.env /opt/app/.env.production.local

RUN pnpm build:vercel

CMD [ "pnpm", "start" ]