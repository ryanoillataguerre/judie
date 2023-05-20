resource "google_project_service" "domains_googleapis_com" {
  project = "467740700781"
  service = "domains.googleapis.com"
}
# terraform import google_project_service.domains_googleapis_com 467740700781/domains.googleapis.com
