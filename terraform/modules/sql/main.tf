resource "google_sql_database_instance" "default" {
  database_version = "POSTGRES_14"
  name             = var.db_name
  project          = var.project
  region           = var.region

  settings {
    activation_policy = "ALWAYS"
    availability_type = "REGIONAL"
    pricing_plan      = "PER_USE"
    tier              = var.db_tier

    database_flags {
      name  = "max_connections"
      value = var.max_connections
    }

    # necessary for change logs
    database_flags {
      name  = "cloudsql.logical_decoding"
      value = var.logical_decoding
    }

    backup_configuration {
      enabled = var.backups_enabled
    }

    disk_autoresize       = true
    disk_autoresize_limit = 0
    disk_size             = var.disk_size
    disk_type             = "PD_SSD"

    insights_config {
      query_insights_enabled = false
    }

    ip_configuration {
      authorized_networks {
        name  = "ryan-home"
        value = "76.33.133.137"
      }
      authorized_networks {
        name  = "brody-cupertino"
        value = "174.160.87.132"
      }
      authorized_networks {
        name  = "brody-oc"
        value = "72.196.69.192"
      }
      authorized_networks {
        name  = "datastream_1"
        value = "34.82.254.46"
      }
      authorized_networks {
        name  = "datastream_2"
        value = "35.247.10.221"
      }
      authorized_networks {
        name  = "datastream_3"
        value = "34.82.253.59"
      }
      authorized_networks {
        name  = "datastream_4"
        value = "35.233.208.195"
      }
      authorized_networks {
        name  = "datastream_5"
        value = "35.247.95.52"
      }

      ipv4_enabled    = true
      private_network = var.private_network_link
    }

    location_preference {
      zone = "us-west1-a"
    }
  }

  lifecycle {
    ignore_changes = [settings[0].ip_configuration]
  }
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
}

resource "google_sql_user" "db_master_user" {
  instance = google_sql_database_instance.default.name
  name     = "postgres"
  password = random_password.password.result
}
