resource "google_project_service" "oslogin_googleapis_com" {
  project = "467740700781"
  service = "oslogin.googleapis.com"
}
# terraform import google_project_service.oslogin_googleapis_com 467740700781/oslogin.googleapis.com
