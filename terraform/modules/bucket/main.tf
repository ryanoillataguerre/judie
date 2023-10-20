resource "google_storage_bucket" "default" {
  name          = var.name
  force_destroy = false
  location      = var.location
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

