#!/usr/bin/env bash
cd "${0%/*}"
ROOT_DIR="$(cd ../..; pwd)"

cd $ROOT_DIR/services

docker buildx build --platform linux/amd64 --build-context project=.  -t us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest inference_service/
docker push us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest
