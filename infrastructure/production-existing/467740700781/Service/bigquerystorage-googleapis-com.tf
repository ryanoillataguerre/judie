resource "google_project_service" "bigquerystorage_googleapis_com" {
  project = "467740700781"
  service = "bigquerystorage.googleapis.com"
}
# terraform import google_project_service.bigquerystorage_googleapis_com 467740700781/bigquerystorage.googleapis.com
