resource "google_project_service" "cloudbuild_googleapis_com" {
  project = "467740700781"
  service = "cloudbuild.googleapis.com"
}
# terraform import google_project_service.cloudbuild_googleapis_com 467740700781/cloudbuild.googleapis.com
