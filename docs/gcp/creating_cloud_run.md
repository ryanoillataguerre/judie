## Service

Create service on Cloud Run

- Attach env vars (to be migrated to Secrets later)
  - `DATABASE_URL=postgresql://postgres:d69rttv4bctzvjjpx8dzkgphkw7wr@{CLOUD_SQLPUBLIC_IP_ADDR}:5432/postgres`
- Create a Cloud SQL connection

### Redis

- Create a Redis instance (if necessary)

  - `gcloud redis instances create --project=judieai prod-redis --tier=standard --size=16 --region=us-west1 --redis-version=redis_6_x --network=projects/judieai/global/networks/default --read-replicas-mode=READ_REPLICAS_ENABLED --replica-count=2 --connect-mode=DIRECT_PEERING --persistence-mode=RDB --rdb-snapshot-period=24h --rdb-snapshot-start-time=2023-04-02T07:00:00.000Z`

- Create a cloud connector

  - `gcloud compute networks vpc-access connectors create cloud-run-connector --network default --region us-west1 --range 10.8.0.0/28`

- Attach connector to the Cloud Run service
  - `gcloud run services update prod-app-service --vpc-connector cloud-run-connector`
