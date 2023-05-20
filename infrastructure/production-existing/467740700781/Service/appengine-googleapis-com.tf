resource "google_project_service" "appengine_googleapis_com" {
  project = "467740700781"
  service = "appengine.googleapis.com"
}
# terraform import google_project_service.appengine_googleapis_com 467740700781/appengine.googleapis.com
