FROM node:18

WORKDIR /app

# Bootstrap directory
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src/ ./src
COPY prisma ./prisma/

# Install packages
RUN yarn

RUN npx prisma generate --schema prisma/schema.prisma

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]
