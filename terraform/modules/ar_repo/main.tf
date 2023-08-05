module "artifactregistry_repo" {
  resource "google_artifact_registry_repository" {
    format        = "DOCKER"
    location      = "us-west1"
    project       = var.project
    repository_id = var.repo_id
  }
}
