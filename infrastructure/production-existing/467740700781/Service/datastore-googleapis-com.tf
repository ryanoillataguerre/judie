resource "google_project_service" "datastore_googleapis_com" {
  project = "467740700781"
  service = "datastore.googleapis.com"
}
# terraform import google_project_service.datastore_googleapis_com 467740700781/datastore.googleapis.com
