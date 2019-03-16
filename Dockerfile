FROM node:11.11.0-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn --version
RUN yarn install

COPY src src
RUN yarn build

EXPOSE 3000

CMD yarn start