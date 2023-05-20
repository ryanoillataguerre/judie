## How to use our terraform

#### Prereqs

- Access to GCP
- A downloaded Service Account JSON file for the corresponding environment's `terraform` Service Account
  - These should be named `prod-sa-key.json` and `sandbox-sa-key.json`, and should be in this README document's folder (parallel to README)

### How to make changes

- Add or edit the resource you want in the corresponding environment's folder (`production` or `sandbox`)
- **From the environment's folder** run the following:
  - `terraform plan --var-file=sandbox.tfvars`
- If all of the changes look good and necessary (no unintended side effects especially), go ahead and run:
  - `terraform apply --var-file=sandbox.tfvars`
