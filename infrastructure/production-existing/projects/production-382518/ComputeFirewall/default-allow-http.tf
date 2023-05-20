resource "google_compute_firewall" "default_allow_http" {
  allow {
    ports    = ["80"]
    protocol = "tcp"
  }

  direction     = "INGRESS"
  name          = "default-allow-http"
  network       = "https://www.googleapis.com/compute/v1/projects/production-382518/global/networks/default"
  priority      = 1000
  project       = "production-382518"
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
}
# terraform import google_compute_firewall.default_allow_http projects/production-382518/global/firewalls/default-allow-http
