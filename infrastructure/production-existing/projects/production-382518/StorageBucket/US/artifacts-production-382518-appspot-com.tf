resource "google_storage_bucket" "artifacts_production_382518_appspot_com" {
  force_destroy            = false
  location                 = "US"
  name                     = "artifacts.production-382518.appspot.com"
  project                  = "production-382518"
  public_access_prevention = "inherited"
  storage_class            = "STANDARD"
}
# terraform import google_storage_bucket.artifacts_production_382518_appspot_com artifacts.production-382518.appspot.com
