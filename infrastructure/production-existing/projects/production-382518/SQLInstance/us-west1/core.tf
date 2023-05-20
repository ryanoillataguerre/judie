resource "google_sql_database_instance" "core" {
  database_version = "POSTGRES_14"
  name             = "core"
  project          = "production-382518"
  region           = "us-west1"

  settings {
    activation_policy = "ALWAYS"
    availability_type = "REGIONAL"

    backup_configuration {
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }

      enabled                        = true
      location                       = "us"
      point_in_time_recovery_enabled = true
      start_time                     = "06:00"
      transaction_log_retention_days = 7
    }

    disk_autoresize       = true
    disk_autoresize_limit = 0
    disk_size             = 100
    disk_type             = "PD_SSD"

    insights_config {
      query_insights_enabled = true
      query_string_length    = 1024
      record_client_address  = true
    }

    ip_configuration {
      authorized_networks {
        name  = "ryan-home"
        value = "76.33.133.137"
      }

      ipv4_enabled    = true
      private_network = "projects/production-382518/global/networks/default"
    }

    location_preference {
      zone = "us-west1-a"
    }

    maintenance_window {
      update_track = "stable"
    }

    pricing_plan = "PER_USE"
    tier         = "db-custom-2-7680"
  }
}
# terraform import google_sql_database_instance.core projects/production-382518/instances/core
