# Judie

Judie monorepo

The repo is structured as follows

```
infrastructure
- common utils
services
- (*)service
-- service specific infrastructure
-- service application code
```

# To Start Up Services

- Get `services/.env` file from someone
- Install dependencies with `yarn` in `web` and `app-service`
- Run `make run` in `services/`
- Create a `.env` in `app-service` with the following: `DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"`
  - This file will help with migrations locally

# To Run Migrations

- `cd app-service`
- `npx prisma generate --schema=prisma/schema.prisma`
- `npx prisma migrate dev`
- You may need to switch your `app-service/.env` `DATABASE_URL` to `DATABASE_URL="postgresql://postgres:postgres@localhost:5438/postgres"` depending on if you're running this inside the container or locally.

# To Deploy Images

## Make sure you've authenticated with GCloud

- (If you haven't installed GCloud CLI) `brew install gcloud`
- `gcloud auth login`

## Make sure you've authenticated with Docker and GCR

- `gcloud auth configure-docker gcr.io`

## Build and push the corresponding service's Docker Image

- `docker buildx build --platform linux/amd64 -t gcr.io/judieai/prod-web:latest .`
- `docker push gcr.io/judieai/prod-web:latest`

## Go into the GCP console and redeploy a new revision Cloud Run

- If someone wants to figure out how to do this through the CLI and add the command here, that would be dandy.
