output "connector_id" {
  value       = google_vpc_access_connector.connector.id
  description = "VPC Access Connector ID"
}

output "private_network_link" {
  value       = google_compute_network.private_network.self_link
  description = "VPC Access Connector Self Link"
}

output "private_network_id" {
  value       = google_compute_network.private_network.id
  description = "VPC Access Connector Self Link"
}
