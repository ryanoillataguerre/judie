#!/usr/bin/bash

docker buildx build --platform linux/amd64 -t us-west1-docker.pkg.dev/sandbox-382905/app-service/app-service:latest ../../services --file=../../services/app-service/Dockerfile && \
	docker push us-west1-docker.pkg.dev/sandbox-382905/app-service/app-service:latest && \
	gcloud run deploy app-service --image us-west1-docker.pkg.dev/sandbox-382905/app-service/app-service:latest --platform managed --region us-west1 --project=sandbox-382905