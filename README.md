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
