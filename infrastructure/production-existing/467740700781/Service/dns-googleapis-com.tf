resource "google_project_service" "dns_googleapis_com" {
  project = "467740700781"
  service = "dns.googleapis.com"
}
# terraform import google_project_service.dns_googleapis_com 467740700781/dns.googleapis.com
