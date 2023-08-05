resource "google_artifact_registry_repository" "default" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = var.project
  repository_id = var.repo_id
}
