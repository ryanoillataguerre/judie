#!/usr/bin/env bash
cd "${0%/*}"
ROOT_DIR="$(cd ../..; pwd)"

cd $ROOT_DIR/services

docker build . -t us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest -f inference_service/Dockerfile
docker push us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest
