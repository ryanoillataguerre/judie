terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
  required_version = ">= 1.4.6"
}

provider "google" {
  project     = var.gcp_project
  credentials = file(var.gcp_auth_file)
  region      = var.gcp_region
}

# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

# Artifact Registry
resource "google_artifact_registry_repository" "web" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = var.gcp_project
  repository_id = "web"
}

# Create the Cloud Run service
resource "google_cloud_run_service" "web" {
  name = "web"
  location = "us-west1"

  template {
    spec {
      containers {
        // TODO: Replace with our image
        // ${registry.address}:latest ?
        image = "gcr.io/google-samples/hello-app:1.0"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.web.name
  location = google_cloud_run_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Display the service URL
output "service_url" {
  value = google_cloud_run_service.web.status[0].url
}