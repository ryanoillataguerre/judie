resource "google_compute_image" "meilisearch" {
  disk_size_gb = 10

  labels = {
    gce-image-import = "true"
  }

  licenses    = ["https://www.googleapis.com/compute/v1/projects/compute-image-tools/global/licenses/virtual-disk-import"]
  name        = "meilisearch"
  project     = "production-382518"
  source_disk = "https://www.googleapis.com/compute/v1/projects/production-382518/zones/us-central1-c/disks/disk-pbtp5"
}
# terraform import google_compute_image.meilisearch projects/production-382518/global/images/meilisearch
