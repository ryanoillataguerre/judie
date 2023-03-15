FROM node:18

WORKDIR /app

# Bootstrap directory
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src/ ./src

# Install packages
RUN yarn

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]
