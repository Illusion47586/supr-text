FROM node:18.7-alpine

WORKDIR /opt/app

ENV NODE_ENV development

COPY package*.json ./

RUN npm ci 

COPY . /opt/app

RUN npm install --include=dev && npm run build

CMD [ "npm", "start" ]