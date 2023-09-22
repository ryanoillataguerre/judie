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

I also had to add certain roles to the terraform service account, but these were one-offs for sandbox and prod service accounts

And in production:

```
gcloud iam workload-identity-pools create "gha-pool" \
  --project="production-382518" \
  --location="global" \
  --display-name="Github Action Pool"
```

```
gcloud iam workload-identity-pools providers create-oidc "gha-provider" \
  --project="production-382518" \
  --location="global" \
  --workload-identity-pool="gha-pool" \
  --display-name="Github Action Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.aud=assertion.aud,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

```
gcloud iam service-accounts add-iam-policy-binding "terraform@production-382518.iam.gserviceaccount.com" \
  --project="production-382518" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/467740700781/locations/global/workloadIdentityPools/gha-pool/attribute.repository/judie/judie"
```

```
gcloud projects add-iam-policy-binding production-382518 \
    --member="serviceAccount:terraform@production-382518.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"
```

```
gcloud iam service-accounts add-iam-policy-binding "terraform@production-382518.iam.gserviceaccount.com" --project="production-382518" --role="roles/iam.serviceAccountTokenCreator" --member=serviceAccount:terraform@production-382518.iam.gserviceaccount.com
```