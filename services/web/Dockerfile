FROM node:18

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn
RUN yarn global add agentkeepalive
RUN yarn global add

COPY ./src /app
COPY ./public /app

EXPOSE 3000

CMD ["yarn", "dev"]