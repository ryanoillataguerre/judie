resource "random_id" "bucket_prefix" {
  byte_length = 8
}
# Store backend state in Cloud Storage
# https://cloud.google.com/docs/terraform/resource-management/store-state
resource "google_storage_bucket" "default" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

