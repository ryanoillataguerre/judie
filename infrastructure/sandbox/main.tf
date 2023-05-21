# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

# Enables the VPC Access API
resource "google_project_service" "vpcaccess-api" {
  project = var.gcp_project
  service = "vpcaccess.googleapis.com"
}


resource "google_compute_network" "vpc_network" {
  name = "default-vpc"
}
resource "google_compute_subnetwork" "public-subnetwork" {
  name = "default-subnet"
  ip_cidr_range = "10.8.0.0/28"
  region = "us-west1"
  network = google_compute_network.vpc_network.name
}

# Store backend state in Cloud Storage
# https://cloud.google.com/docs/terraform/resource-management/store-state
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

resource "google_vpc_access_connector" "connector" {
  name          = "vpc-access-conn"
  subnet {
    name = google_compute_subnetwork.public-subnetwork.name
  }
  min_instances = 2
  max_instances = 3
  project = var.gcp_project
  region  = var.gcp_region
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
      # private_network = google_compute_network.vpc_network.name
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
  authorized_network      = google_compute_network.vpc_network.id
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
          value = "postgres://postgres:${random_password.core_db_master_user_password.result}@:5432/postgres?host=/cloudsql/${var.gcp_project}:us-west1:core"
        }
        env {
          name = "REDIS_HOST"
          value = google_redis_instance.redis-core.host
        }
        env {
          name = "REDIS_PORT"
          value = "6379"
        }
        env {
          name = "NODE_ENV"
          value = "sandbox"
        }
        // TODO: Add rest of ENV vars 
        env {
          name = "OPENAI_API_KEY"
          value = var.env_openai_api_key
        }
        env {
          name = "PINECONE_API_KEY"
          value = var.env_pinecone_api_key
        }
        env {
          name = "PINECONE_ENVIRONMENT"
          value = var.env_pinecone_environment
        }
        env {
          name = "SESSION_SECRET"
          value = var.env_session_secret
        }
        env {
          name = "STRIPE_WEBHOOK_SECRET"
          value = var.env_stripe_whsec
        }
        env {
          name = "STRIPE_MONTHLY_PRICE_ID"
          value = var.env_stripe_monthly_price_id
        }
        env {
          name = "STRIPE_COUPON_ID"
          value = var.env_stripe_coupon_id
        }
        env {
          name = "STRIPE_SK"
          value = var.env_stripe_sk
        }
        env {
          name = "STRIPE_EMPLOYEE_COUPON_ID"
          value = var.env_stripe_employee_coupon_id
        }
        liveness_probe {
          initial_delay_seconds = 10
          failure_threshold = 3
          http_get {
            path = "/healthcheck"
            port = 8080
          }
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "100"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.core.connection_name
        "run.googleapis.com/client-name"        = "cloud-console"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api, google_redis_instance.redis-core, google_sql_database_instance.core, google_artifact_registry_repository.app-service, google_vpc_access_connector.connector]
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
          value = google_cloud_run_service.app-service.status[0].url
        }
      }
    }
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "all-traffic"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api, google_cloud_run_service.app-service, google_artifact_registry_repository.web]
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.web.name
  location = google_cloud_run_service.web.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Display the service URLs
output "web_url" {
  value = google_cloud_run_service.web.status[0].url
}
output "app_service_url" {
  value = google_cloud_run_service.app-service.status[0].url
}