resource "google_project_service" "testing_googleapis_com" {
  project = "467740700781"
  service = "testing.googleapis.com"
}
# terraform import google_project_service.testing_googleapis_com 467740700781/testing.googleapis.com
