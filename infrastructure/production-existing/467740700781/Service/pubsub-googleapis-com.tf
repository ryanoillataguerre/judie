resource "google_project_service" "pubsub_googleapis_com" {
  project = "467740700781"
  service = "pubsub.googleapis.com"
}
# terraform import google_project_service.pubsub_googleapis_com 467740700781/pubsub.googleapis.com
