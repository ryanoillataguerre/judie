resource "google_project_service" "serviceusage_googleapis_com" {
  project = "467740700781"
  service = "serviceusage.googleapis.com"
}
# terraform import google_project_service.serviceusage_googleapis_com 467740700781/serviceusage.googleapis.com
