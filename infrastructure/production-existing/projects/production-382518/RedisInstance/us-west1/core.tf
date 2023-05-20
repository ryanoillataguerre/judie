resource "google_redis_instance" "core" {
  authorized_network      = "projects/production-382518/global/networks/default"
  connect_mode            = "DIRECT_PEERING"
  location_id             = "us-west1-a"
  memory_size_gb          = 1
  name                    = "core"
  project                 = "production-382518"
  read_replicas_mode      = "READ_REPLICAS_DISABLED"
  redis_version           = "REDIS_6_X"
  region                  = "us-west1"
  reserved_ip_range       = "10.229.30.64/29"
  tier                    = "BASIC"
  transit_encryption_mode = "DISABLED"
}
# terraform import google_redis_instance.core production-382518/us-west1/core
