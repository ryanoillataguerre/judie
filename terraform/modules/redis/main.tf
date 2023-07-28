module "redis" {
  resource "google_redis_instance" "redis-core" {
    authorized_network      = google_compute_network.private_network.id
    connect_mode            = "DIRECT_PEERING"
    location_id             = "us-west1-a"
    memory_size_gb          = 1
    name                    = "redis-core"
    project                 = var.gcp_project
    read_replicas_mode      = "READ_REPLICAS_DISABLED"
    redis_version           = "REDIS_6_X"
    region                  = "us-west1"
    tier                    = "BASIC"
    transit_encryption_mode = "DISABLED"
    # In Prod?
    # persistence_config = {
    #   persistence_mode    = "RDB"
    #   rdb_snapshot_period = "ONE_HOUR"
    # }
  }
}