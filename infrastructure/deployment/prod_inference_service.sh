#!/usr/bin/env bash

docker buildx build --platform linux/amd64 -t us-west1-docker.pkg.dev/production-382518/inference-service/inference_service:latest $(dirname "$0")/../../services --file=../../services/inference_service/Dockerfile && \
	docker push us-west1-docker.pkg.dev/production-382518/inference-service/inference_service:latest && \
	gcloud run deploy inference-service --image us-west1-docker.pkg.dev/production-382518/inference-service/inference_service:latest --platform managed --region us-west1 --project=production-382518