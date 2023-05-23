FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/prisma ./prisma
COPY --from=builder ./app/protos ./protos
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
RUN npx prisma generate --schema prisma/schema.prisma

EXPOSE 8080

CMD [ "yarn", "start" ]
