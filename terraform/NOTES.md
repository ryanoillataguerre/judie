## Things we need to import:

### Workload Identity Federation

I ran the following to set up our WIF in sandbox:

```
gcloud iam workload-identity-pools create "github-actions" \
  --project="sandbox-382905" \
  --location="global" \
  --display-name="Github Action Pool"
```

```
gcloud iam workload-identity-pools providers create-oidc "gha-provider" \
  --project="sandbox-382905" \
  --location="global" \
  --workload-identity-pool="github-actions" \
  --display-name="Github Action Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.aud=assertion.aud" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

```
gcloud iam service-accounts add-iam-policy-binding "terraform@sandbox-382905.iam.gserviceaccount.com" \
  --project="sandbox-382905" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/617839389948/locations/global/workloadIdentityPools/github-actions/attribute.repository/judie/judie"
```

```
gcloud projects add-iam-policy-binding sandbox-382905 \
    --member="serviceAccount:terraform@sandbox-382905.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"
```