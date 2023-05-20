resource "google_project_service" "storage_googleapis_com" {
  project = "467740700781"
  service = "storage.googleapis.com"
}
# terraform import google_project_service.storage_googleapis_com 467740700781/storage.googleapis.com
