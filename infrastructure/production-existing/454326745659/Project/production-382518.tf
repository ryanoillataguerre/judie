resource "google_project" "production_382518" {
  auto_create_network = true
  billing_account     = "0137FF-71CC6C-E55F2B"

  labels = {
    firebase = "enabled"
  }

  name       = "production"
  org_id     = "454326745659"
  project_id = "production-382518"
}
# terraform import google_project.production_382518 projects/production-382518
