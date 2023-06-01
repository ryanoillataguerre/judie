## Make sure you have an IAM account on our GCP Org

- Contact Ryan or Brody to get added

## Install gcloud locally

- `brew install gcloud`

## Authenticate and set sandbox as default project

- `gcloud auth login`
- `gcloud config set project {sandbox_project_id}`
- `gcloud config set run/region us-west1`

## Handy

#### Add allowed network (in this example, local for testing)

- `gcloud sql instances patch prod-core --authorized-networks={LOCAL_IP}`
