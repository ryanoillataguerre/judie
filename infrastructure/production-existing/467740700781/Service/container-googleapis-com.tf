resource "google_project_service" "container_googleapis_com" {
  project = "467740700781"
  service = "container.googleapis.com"
}
# terraform import google_project_service.container_googleapis_com 467740700781/container.googleapis.com
