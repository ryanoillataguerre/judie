## How to use our terraform

#### Prereqs

- Access to GCP
- A downloaded Service Account JSON file for the corresponding environment's `terraform` Service Account
  - These should be named `prod-sa-key.json` and `sandbox-sa-key.json`, and should be in this README document's folder (parallel to README)

### How to make changes

- Run `terraform init` in the corresponding environment's folder (`production` or `sandbox`)
- Add or edit the resource you want
- **From the environment's folder** run the following:
  - `terraform plan --var-file=sandbox.tfvars`
- If all of the changes look good and necessary (no unintended side effects especially), go ahead and run:
  - `terraform apply --var-file=sandbox.tfvars`
- If you get 400 or authentication errors while initializing or planning/applying, run the following:
  - `export GOOGLE_APPLICATION_CREDENTIALS=./sandbox-sa-key.json // path to service account json file`

### What has been manually created?

#### Sandbox

- Custom Cloud Run domain mappings for Cloud Run services `web` and `app-service`
- DNS rules

#### Prod

- DNS rules
- Everything, as of now
