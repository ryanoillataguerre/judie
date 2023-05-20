resource "google_project_service" "sqladmin_googleapis_com" {
  project = "467740700781"
  service = "sqladmin.googleapis.com"
}
# terraform import google_project_service.sqladmin_googleapis_com 467740700781/sqladmin.googleapis.com
