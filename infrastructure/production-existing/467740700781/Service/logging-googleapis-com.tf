resource "google_project_service" "logging_googleapis_com" {
  project = "467740700781"
  service = "logging.googleapis.com"
}
# terraform import google_project_service.logging_googleapis_com 467740700781/logging.googleapis.com
