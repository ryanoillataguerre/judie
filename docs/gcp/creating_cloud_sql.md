- First I created a Cloud SQL instance with a Public IP

## Add allowed network (in this example, local for testing)

- `gcloud sql instances patch prod-core --authorized-networks={LOCAL_IP}`
