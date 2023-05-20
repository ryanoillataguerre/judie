resource "google_project_service" "servicemanagement_googleapis_com" {
  project = "467740700781"
  service = "servicemanagement.googleapis.com"
}
# terraform import google_project_service.servicemanagement_googleapis_com 467740700781/servicemanagement.googleapis.com
