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


# # New
# FROM node:18-alpine AS dependencies
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# RUN yarn
# COPY . .

# # Rebuild the source code only when needed
# FROM dependencies AS builder
# WORKDIR /app
# COPY --from=dependencies /app ./
# RUN yarn build

# # Production image, copy all the files and run next
# FROM node:18-alpine AS runner
# WORKDIR /app
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma


# CMD ["yarn", "start"]
