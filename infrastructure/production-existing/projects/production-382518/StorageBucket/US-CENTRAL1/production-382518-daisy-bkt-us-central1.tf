resource "google_storage_bucket" "production_382518_daisy_bkt_us_central1" {
  force_destroy               = false
  location                    = "US-CENTRAL1"
  name                        = "production-382518-daisy-bkt-us-central1"
  project                     = "production-382518"
  public_access_prevention    = "inherited"
  storage_class               = "REGIONAL"
  uniform_bucket_level_access = true
}
# terraform import google_storage_bucket.production_382518_daisy_bkt_us_central1 production-382518-daisy-bkt-us-central1
