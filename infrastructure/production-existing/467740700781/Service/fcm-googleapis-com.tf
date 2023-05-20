resource "google_project_service" "fcm_googleapis_com" {
  project = "467740700781"
  service = "fcm.googleapis.com"
}
# terraform import google_project_service.fcm_googleapis_com 467740700781/fcm.googleapis.com
