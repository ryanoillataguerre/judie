resource "google_compute_global_address" "default_ip_range" {
  address       = "10.60.16.0"
  address_type  = "INTERNAL"
  name          = "default-ip-range"
  network       = "https://www.googleapis.com/compute/v1/projects/production-382518/global/networks/default"
  prefix_length = 20
  project       = "production-382518"
  purpose       = "VPC_PEERING"
}
# terraform import google_compute_global_address.default_ip_range projects/production-382518/global/addresses/default-ip-range
