resource "google_artifact_registry_repository" "web" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = "production-382518"
  repository_id = "web"
}
# terraform import google_artifact_registry_repository.web projects/production-382518/locations/us-west1/repositories/web
