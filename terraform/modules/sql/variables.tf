variable "db_name" {
  type        = string
  description = "Name of DB instance"
}
variable "project" {
  type        = string
  description = "GCP Project"
}
variable "gcp_region" {
  type        = string
  description = "GCP Region"
}
variable "db_tier" {
  type        = string
  description = "DB Tier"
}
variable "disk_size" {
  type        = number
  default     = 50
  description = "Disk size (GB)"
}
