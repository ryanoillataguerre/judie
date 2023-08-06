### All `docker build` functionality must be run from the `services` directory to pull in neccessary files

### To build inference-service image for local testing:
` docker buildx build --build-context project=.  -t inference_test_image inference_service/`

Of course, run from the `services` directory

### To run container locally:
`docker run -p 443:443 --env-file=inference_service/.env inference_test_image`

### To build inference-service image for production:
` docker buildx build --platform linux/amd64 --build-context project=.  -t us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest inference_service/`

Of course, run from the `services` directory
