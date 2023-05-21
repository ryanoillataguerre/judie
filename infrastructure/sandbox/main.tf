terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
  required_version = ">= 1.4.6"
}

provider "google" {
  project     = var.gcp_project
  credentials = file(var.gcp_auth_file)
  region      = var.gcp_region
}

# Store backend state in Cloud Storage
resource "random_id" "bucket_prefix" {
  byte_length = 8
}

resource "google_storage_bucket" "default" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

# Create a Cloud SQL DB
resource "google_sql_database_instance" "core" {
  database_version = "POSTGRES_14"
  name             = "core"
  project          = var.gcp_project
  region           = var.gcp_region

  settings {
    activation_policy = "ALWAYS"
    availability_type = "REGIONAL"
    pricing_plan = "PER_USE"
    tier         = "db-f1-micro"
    
    backup_configuration {
      enabled                        = false
    }

    disk_autoresize       = true
    disk_autoresize_limit = 0
    disk_size             = 50
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
      # private_network = "projects/${var.gcp_project}/global/networks/default"
    }

    location_preference {
      zone = "us-west1-a"
    }
  }
}

resource "random_password" "core_db_master_user_password" {
  length = 16
}

resource "google_sql_user" "core_db_master_user" {
  instance = google_sql_database_instance.core.name
  name     = "postgres"
  password = random_password.core_db_master_user_password.result
}

# Redis Instance
resource "google_redis_instance" "redis-core" {
  authorized_network      = "projects/${var.gcp_project}/global/networks/default"
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

# Artifact Registry
resource "google_artifact_registry_repository" "web" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = var.gcp_project
  repository_id = "web"
}
resource "google_artifact_registry_repository" "app-service" {
  format        = "DOCKER"
  location      = "us-west1"
  project       = var.gcp_project
  repository_id = "app-service"
}

# Create the Cloud Run service
resource "google_cloud_run_service" "app-service" {
  name = "app-service"
  location = "us-west1"

  template {
    spec {
      containers {
        image = "us-west1-docker.pkg.dev/${var.gcp_project}/app-service/app-service:latest"
        env {
          name = "DATABASE_URL"
          value = "postgres://postgres:${random_password.core_db_master_user_password.result}@:5432/postgres?host=/cloudsql/production-382518:us-west1:core"
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "1000"
        # "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.core.connection_name - possible option?
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.core.connection_name
        "run.googleapis.com/client-name"        = "cloud-console"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]
}
resource "google_cloud_run_service" "web" {
  name = "web"
  location = "us-west1"

  template {
    spec {
      containers {
        image = "us-west1-docker.pkg.dev/${var.gcp_project}/web/web:latest"
        env {
          name = "NEXT_PUBLIC_NODE_ENV"
          value = "sandbox"
        }
        env {
          name = "NEXT_PUBLIC_API_URI"
          # TODO: App Service URL
          value = ""
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # Waits for the Cloud Run API to be enabled
  depends_on = [google_project_service.run_api]
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.web.name
  location = google_cloud_run_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Display the service URL
output "service_url" {
  value = google_cloud_run_service.web.status[0].url
}