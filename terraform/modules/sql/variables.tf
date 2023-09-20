variable "db_name" {
  type        = string
  description = "Name of DB instance"
}
variable "project" {
  type        = string
  description = "GCP Project"
}
variable "region" {
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

variable "backups_enabled" {
  type        = bool
  default     = true
  description = "Enable backups"
}

variable "private_network_link" {
  type        = string
  description = "Private network link"
}

variable "max_connections" {
  type        = number
  default     = 100
  description = "Max connections"
}

variable "logical_decoding" {
  type        = bool
  default     = true
  description = "Decoding to enable external replicas of DB"
}
