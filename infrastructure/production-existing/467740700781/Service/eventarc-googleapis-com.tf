resource "google_project_service" "eventarc_googleapis_com" {
  project = "467740700781"
  service = "eventarc.googleapis.com"
}
# terraform import google_project_service.eventarc_googleapis_com 467740700781/eventarc.googleapis.com
