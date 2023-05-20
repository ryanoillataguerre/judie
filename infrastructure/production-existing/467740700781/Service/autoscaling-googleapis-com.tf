resource "google_project_service" "autoscaling_googleapis_com" {
  project = "467740700781"
  service = "autoscaling.googleapis.com"
}
# terraform import google_project_service.autoscaling_googleapis_com 467740700781/autoscaling.googleapis.com
