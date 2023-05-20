resource "google_project_service" "run_googleapis_com" {
  project = "467740700781"
  service = "run.googleapis.com"
}
# terraform import google_project_service.run_googleapis_com 467740700781/run.googleapis.com
