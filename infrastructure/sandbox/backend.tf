# https://cloud.google.com/docs/terraform/resource-management/store-state
terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
 backend "gcs" {
   bucket  = "b09bcadeb5f255f1-bucket-tfstate"
   prefix  = "terraform/state"
 }
}

provider "google" {
  project     = var.gcp_project
  credentials = file(var.gcp_auth_file)
  region      = var.gcp_region
}