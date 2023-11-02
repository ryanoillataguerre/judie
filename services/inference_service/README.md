### All `docker build` functionality must be run from the `services` directory to pull in neccessary files

### To build inference-service image for local testing:
` docker buildx build --build-context project=.  -t inference_test_image inference_service/`

Of course, run from the `services` directory

### To run container locally:
`docker run -p 443:443 --env-file=inference_service/.env inference_test_image`

### To run an interactive session with the inference service

* pyenv
* tmux
  - ctrl + b arrow keys to move around the panes
  - ctrl + b then arrow keys or pgUp/pgDn to scroll in a pane (q to exit scroll mode)
* local db

**Trouble shooting**
* docker volume ls
* docker ps -a (docker container ls -a)
* docker container rm <id>
* docker volume rm <name>
* prisma generate --schema $ROOT_DIR/services/app-service/prisma/schema.prisma --generator client-py

### To build inference-service image for production:
` docker buildx build --platform linux/amd64 --build-context project=.  -t us-west1-docker.pkg.dev/sandbox-382905/inference-service/inference_service:latest inference_service/`

Of course, run from the `services` directory
