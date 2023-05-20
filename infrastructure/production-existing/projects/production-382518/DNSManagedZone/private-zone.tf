resource "google_dns_managed_zone" "private_zone" {
  dns_name      = "services.judie.io."
  force_destroy = false
  name          = "private-zone"
  project       = "production-382518"
  visibility    = "private"
}
# terraform import google_dns_managed_zone.private_zone projects/production-382518/managedZones/private-zone
