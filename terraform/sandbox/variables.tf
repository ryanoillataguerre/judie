# GCP authentication file
variable "gcp_auth_file" {
  type        = string
  description = "GCP authentication file"
}
# define GCP region
variable "gcp_region" {
  type        = string
  description = "GCP region"
}
# define GCP project name
variable "gcp_project" {
  type        = string
  description = "GCP project name"
}

variable "env_openai_api_key" {
  type = string
  description = "OpenAI API Key"
}
variable "env_pinecone_api_key" {
  type = string
  description = "Pinecone API Key"
}
variable "env_pinecone_environment" {
  type = string
  description = "Pinecone zone"
}
variable "env_session_secret" {
  type = string
  description = "Session secret"
}
variable "env_stripe_whsec" {
  type = string
  description = "Stripe webhook secret"
}
variable "env_stripe_monthly_price_id" {
  type = string
  description = "Stripe monthly planprice ID"
}
variable "env_stripe_coupon_id" {
  type = string
  description = "Stripe intro coupon ID"
}
variable "env_stripe_sk" {
  type = string
  description = "Stripe secret key"
}
variable "env_stripe_employee_coupon_id" {
  type = string
  description = "Stripe employee coupon ID"
}

variable "env_customerio_api_key" {
  type = string
  description = "CustomerIO API Key"
}
variable "env_customerio_app_api_key" {
  type = string
  description = "CustomerIO App API Key"
}

variable "env_customerio_site_id" {
  type = string
  description = "CustomerIO site ID"
}

variable "grpc_port" {
  type = string
  description = "Port Cloud Run sends gRPC traffic over"
}
variable "grpc_health_port" {
  type = string
  description = "Port Cloud Run sends gRPC based health and liveliness checks over"
}