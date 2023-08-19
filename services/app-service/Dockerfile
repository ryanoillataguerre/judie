FROM node:20 AS builder
WORKDIR /app
COPY ./build_protos.sh /opt/build_protos.sh
COPY app-service .
# RUN sudo apt-get update
# RUN sudo apt-get install ghostscript
# RUN sudo apt-get install graphicsmagick
# COPY protos/inference_service/server/inference_service.proto ./protos/inference_service.proto
RUN yarn install
RUN yarn run generate
RUN /opt/build_protos.sh
RUN yarn build

FROM node:20-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY --from=builder ./app/prisma ./prisma
COPY --from=builder ./app/protos ./protos
COPY app-service/package.json .
COPY app-service/yarn.lock .
RUN yarn install --production
RUN yarn run generate

EXPOSE 8080

CMD [ "yarn", "start" ]
