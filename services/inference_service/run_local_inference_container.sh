#!/usr/bin/env bash
cd "${0%/*}"
cd ..

docker buildx build -t us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest --file=inference_service/Dockerfile .
docker run -p 443:443 -p 8080:8080 --env-file=inference_service/.env us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest