resource "google_project_service" "monitoring_googleapis_com" {
  project = "467740700781"
  service = "monitoring.googleapis.com"
}
# terraform import google_project_service.monitoring_googleapis_com 467740700781/monitoring.googleapis.com
