# Judie

Judie monorepo

The repo is structured as follows

`services/`
  - `{service}`
    - `{service}` specific application code

`terraform/`
  - `modules`
    - common modules we use across ENVs that were made reusable
  - `{environment}`
    - `{environment}` specific infrastructure

`infrastructure/`
  - Local utils

`notebooks/`
  - Jupyter Notebooks for ML team


# To Start Up Services Locally

- Get `services/.env` file from someone (@ryanoillataguerre as a fallback)
- Install dependencies with `yarn` in `web` and `app-service`
- Run `make run` in `services/`
- Create a `.env` in `app-service` with the following: `DATABASE_URL="postgresql://postgres:postgres@postgres:5432/postgres"`
  - This file will help with migrations locally
  - `cd services/app-service`
  - `yarn`
  - `yarn migrate`
  - `yarn generate`
- You need to migrate and generate the Prisma schema if you're developing on `app-service` locally, or it won't run successfully or give you TS errors in your editor.
