resource "google_compute_route" "peering_route_568280b754284205" {
  description = "Auto generated route via peering [servicenetworking-googleapis-com]."
  dest_range  = "10.60.16.0/24"
  name        = "peering-route-568280b754284205"
  network     = "https://www.googleapis.com/compute/v1/projects/production-382518/global/networks/default"
  priority    = 0
  project     = "production-382518"
}
# terraform import google_compute_route.peering_route_568280b754284205 projects/production-382518/global/routes/peering-route-568280b754284205
