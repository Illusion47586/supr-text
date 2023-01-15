FROM node:18.7-alpine

RUN curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=7 sh -

WORKDIR /opt/app

ENV NODE_ENV development

COPY package*.json ./

RUN pnpm i 

COPY . /opt/app

RUN pnpm i && pnpm build

CMD [ "pnpm", "start" ]