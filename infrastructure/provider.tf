terraform {
  required_version = ">= 1.4.6"
}

provider "google" {
  project     = var.gcp_project
  credentials = file(var.gcp_auth_file)
  region      = var.gcp_region
}