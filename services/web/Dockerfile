FROM node:18-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install --prod

COPY . /app
RUN yarn build
# start app
CMD [ "yarn", "start" ]

# FROM node:18-alpine AS dependencies
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package.json yarn.lock ./
# COPY app.json ./
# RUN yarn --prod

# # Rebuild the source code only when needed
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN yarn build

# # Production image, copy all the files and run next
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S web -u 1001

# COPY --from=builder --chown=web:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public

# USER web
# EXPOSE 3000

# CMD ["yarn", "start"]