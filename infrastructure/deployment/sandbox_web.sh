#!/usr/bin/env bash

docker buildx build --platform linux/amd64 --build-arg NEXT_PUBLIC_API_URI=https://app-service.sandbox.judie.io --build-arg NEXT_PUBLIC_NODE_ENV=sandbox -t us-west1-docker.pkg.dev/sandbox-382905/web/web:latest $(dirname "$0")/../../services/web && \
  docker push us-west1-docker.pkg.dev/sandbox-382905/web/web:latest && \
  gcloud run deploy web --image us-west1-docker.pkg.dev/sandbox-382905/web/web:latest --platform managed --region us-west1 --allow-unauthenticated --project=sandbox-382905