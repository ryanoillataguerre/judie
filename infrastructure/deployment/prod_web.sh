#!/usr/bin/env bash

docker buildx build --platform linux/amd64 --build-arg NEXT_PUBLIC_API_URI=https://app-service.judie.io --build-arg NEXT_PUBLIC_NODE_ENV=production --build-arg NEXT_PUBLIC_SEGMENT_WRITE_KEY=$1 --build-arg NEXT_PUBLIC_UPFLUENCE_SCRIPT_ID=$2 --build-arg NEXT_PUBLIC_GA_MEASUREMENT_ID=$3 -t us-west1-docker.pkg.dev/production-382518/web/web:latest $(dirname "$0")/../../services/web && \
  docker push us-west1-docker.pkg.dev/production-382518/web/web:latest && \
  gcloud run deploy web --image us-west1-docker.pkg.dev/production-382518/web/web:latest --platform managed --region us-west1 --allow-unauthenticated --project=production-382518