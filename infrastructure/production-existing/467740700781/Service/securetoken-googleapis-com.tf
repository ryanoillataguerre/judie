resource "google_project_service" "securetoken_googleapis_com" {
  project = "467740700781"
  service = "securetoken.googleapis.com"
}
# terraform import google_project_service.securetoken_googleapis_com 467740700781/securetoken.googleapis.com
