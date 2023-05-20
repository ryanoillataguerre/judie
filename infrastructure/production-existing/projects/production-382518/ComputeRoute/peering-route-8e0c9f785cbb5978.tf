resource "google_compute_route" "peering_route_8e0c9f785cbb5978" {
  description = "Auto generated route via peering [redis-peer-1036351984973]."
  dest_range  = "10.229.30.64/29"
  name        = "peering-route-8e0c9f785cbb5978"
  network     = "https://www.googleapis.com/compute/v1/projects/production-382518/global/networks/default"
  priority    = 0
  project     = "production-382518"
}
# terraform import google_compute_route.peering_route_8e0c9f785cbb5978 projects/production-382518/global/routes/peering-route-8e0c9f785cbb5978
