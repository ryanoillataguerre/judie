variable "web_public_dns_zone" {
  type        = string
  description = "Public DNS zone for the web app"
}
variable "app_service_public_dns_zone" {
  type        = string
  description = "Public DNS zone for the app service"
}
variable "project" {
  type        = string
  description = "GCP Project"
}
variable "access_connector_max_instances" {
  type        = number
  default     = 3
  description = "Maximum number of access connector instances"
}
variable "region" {
  type        = string
  default     = "us-west1"
  description = "GCP Region"
}

variable "name" {
  type        = string
  description = "VPC name"
}
