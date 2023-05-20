resource "google_artifact_registry_repository" "cloud_run_source_deploy" {
  description   = "Cloud Run Source Deployments"
  format        = "DOCKER"
  location      = "us-west1"
  project       = "production-382518"
  repository_id = "cloud-run-source-deploy"
}
# terraform import google_artifact_registry_repository.cloud_run_source_deploy projects/production-382518/locations/us-west1/repositories/cloud-run-source-deploy
