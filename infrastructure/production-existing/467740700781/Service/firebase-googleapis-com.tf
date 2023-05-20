resource "google_project_service" "firebase_googleapis_com" {
  project = "467740700781"
  service = "firebase.googleapis.com"
}
# terraform import google_project_service.firebase_googleapis_com 467740700781/firebase.googleapis.com
