resource "google_dns_managed_zone" "public_zone" {
  dns_name      = "judie.io."
  force_destroy = false
  name          = "public-zone"
  project       = "production-382518"
  visibility    = "public"
}
# terraform import google_dns_managed_zone.public_zone projects/production-382518/managedZones/public-zone
