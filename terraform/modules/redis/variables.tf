variable "private_network_id" {
  type        = string
  description = "ID of the shared private network"
}
variable "instance_name" {
  type        = string
  description = "Name of the redis instance"
}
variable "project" {
  type        = string
  description = "GCP project"
}

variable "region" {
  type        = string
  description = "GCP Region"
}
