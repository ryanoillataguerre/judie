resource "google_project_service" "iamcredentials_googleapis_com" {
  project = "467740700781"
  service = "iamcredentials.googleapis.com"
}
# terraform import google_project_service.iamcredentials_googleapis_com 467740700781/iamcredentials.googleapis.com
