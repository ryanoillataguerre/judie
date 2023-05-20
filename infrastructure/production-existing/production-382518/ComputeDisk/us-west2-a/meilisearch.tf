resource "google_compute_disk" "meilisearch" {
  image                     = "https://www.googleapis.com/compute/beta/projects/debian-cloud/global/images/debian-11-bullseye-v20230411"
  name                      = "meilisearch"
  physical_block_size_bytes = 4096
  project                   = "production-382518"
  size                      = 10
  type                      = "pd-balanced"
  zone                      = "us-west2-a"
}
# terraform import google_compute_disk.meilisearch projects/production-382518/zones/us-west2-a/disks/meilisearch
