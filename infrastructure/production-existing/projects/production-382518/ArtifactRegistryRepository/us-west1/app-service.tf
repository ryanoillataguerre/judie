resource "google_artifact_registry_repository" "app_service" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = "production-382518"
  repository_id = "app-service"
}
# terraform import google_artifact_registry_repository.app_service projects/production-382518/locations/us-west1/repositories/app-service
