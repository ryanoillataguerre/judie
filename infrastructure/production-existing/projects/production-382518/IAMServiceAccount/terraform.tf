resource "google_service_account" "terraform" {
  account_id   = "terraform"
  description  = "Deploy infrastructure"
  display_name = "Terraform"
  project      = "production-382518"
}
# terraform import google_service_account.terraform projects/production-382518/serviceAccounts/terraform@production-382518.iam.gserviceaccount.com
