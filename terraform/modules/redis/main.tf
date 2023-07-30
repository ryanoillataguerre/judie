module "redis" {
  resource "google_redis_instance" {
    authorized_network      = var.private_network_id
    connect_mode            = "DIRECT_PEERING"
    location_id             = "us-west1-a"
    memory_size_gb          = 1
    name                    = var.instance_name
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