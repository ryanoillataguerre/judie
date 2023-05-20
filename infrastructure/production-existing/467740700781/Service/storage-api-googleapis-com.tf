resource "google_project_service" "storage_api_googleapis_com" {
  project = "467740700781"
  service = "storage-api.googleapis.com"
}
# terraform import google_project_service.storage_api_googleapis_com 467740700781/storage-api.googleapis.com
