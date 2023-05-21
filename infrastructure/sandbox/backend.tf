# https://cloud.google.com/docs/terraform/resource-management/store-state
terraform {
 backend "gcs" {
   bucket  = "b09bcadeb5f255f1-bucket-tfstate"
   prefix  = "terraform/state"
 }
}