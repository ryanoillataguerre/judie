resource "google_sql_database_instance" "default" {
  database_version = "POSTGRES_14"
  name             = var.db_name
  project          = var.gcp_project
  region           = var.gcp_region

  settings {
    activation_policy = "ALWAYS"
    availability_type = "REGIONAL"
    pricing_plan = "PER_USE"
    tier         = var.db_tier
    
    backup_configuration {
      enabled                        = false
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

      ipv4_enabled    = true
      private_network = google_compute_network.private_network.self_link
    }

    location_preference {
      zone = "us-west1-a"
    }
  }
  depends_on       = [google_service_networking_connection.private_vpc_connection]
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"
}

resource "google_sql_user" "core_db_master_user" {
  instance = google_sql_database_instance.core.name
  name     = "postgres"
  password = random_password.password.result
}