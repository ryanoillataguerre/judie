# Enables the Cloud Run API
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

  disable_on_destroy = true
}

# Enable necessary management APIs
resource "google_project_service" "vpcaccess-api" {
  project = var.gcp_project
  service = "vpcaccess.googleapis.com"
}
resource "google_project_service" "sqladmin-api" {
  project = var.gcp_project
  service = "sqladmin.googleapis.com"
}

# Create default VPC network
resource "google_compute_network" "vpc_network" {
  name = "default-vpc"
}

# resource "google_compute_subnetwork" "public-subnetwork" {
#   name = "default-subnet"
#   ip_cidr_range = "10.8.0.0/28"
#   region = "us-west1"
#   network = google_compute_network.vpc_network.name
# }

resource "random_id" "bucket_prefix" {
  byte_length = 8
}
# Store backend state in Cloud Storage
# https://cloud.google.com/docs/terraform/resource-management/store-state
resource "google_storage_bucket" "default" {
  name          = "${random_id.bucket_prefix.hex}-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

# Do these matter/make a difference?
resource "google_dns_managed_zone" "web-public" {
  dns_name      = "app.sandbox.judie.io."
  force_destroy = false
  name          = "web-public"
  project       = var.gcp_project
  visibility    = "public"
}

resource "google_dns_managed_zone" "app-service-public" {
  dns_name      = "app-service.sandbox.judie.io."
  force_destroy = false
  name          = "app-service-public"
  project       = var.gcp_project
  visibility    = "public"
}

# Private network
resource "google_compute_network" "private_network" {
  provider = google-beta
  name     = "private-network"
}

# Private Subnet
resource "google_compute_subnetwork" "private-subnetwork" {
  name = "private-subnet"
  ip_cidr_range = "10.10.0.0/28"
  region = "us-west1"
  network = google_compute_network.private_network.name
}

# Reserve global internal address range for the peering
resource "google_compute_global_address" "private_ip_address" {
  provider      = google-beta
  name          = "private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.private_network.self_link
}

# Establish VPC network peering connection using the reserved address range
resource "google_service_networking_connection" "private_vpc_connection" {
  provider                = google-beta
  network                 = google_compute_network.private_network.self_link
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

resource "google_vpc_access_connector" "connector" {
  name          = "vpc-access-conn"
  # network = google_compute_network.private_network.self_link
  subnet {
    name = google_compute_subnetwork.private-subnetwork.name
  }
  # ip_cidr_range = google_compute_global_address.private_ip_address.address
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

# Redis Instance
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
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "us-west1-docker.pkg.dev/${var.gcp_project}/app-service/app-service:latest"
        env {
          name = "DATABASE_URL"
          value = "postgres://postgres:${random_password.password.result}@${google_sql_database_instance.core.private_ip_address}:5432/postgres"
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
        env {
          name = "CUSTOMERIO_API_KEY"
          value = var.env_customerio_api_key
        }
        env {
          name = "CUSTOMERIO_APP_API_KEY"
          value = var.env_customerio_app_api_key
        }
        env {
          name = "CUSTOMERIO_SITE_ID"
          value = var.env_customerio_site_id
        }
        startup_probe {
          initial_delay_seconds = 10
          failure_threshold = 3
          period_seconds = 10
          http_get {
            path = "/healthcheck"
            port = 8080
          }
        }
        liveness_probe {
          initial_delay_seconds = 10
          failure_threshold = 3
          period_seconds = 360
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
        "autoscaling.knative.dev/minScale"      = "1"
        # Is this superfluous now?
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.core.connection_name
        "run.googleapis.com/client-name"        = "cloud-console"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
        "client.knative.dev/user-image"           = "us-west1-docker.pkg.dev/${var.gcp_project}/app-service/app-service:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # This addresses an annoying bug where apply hangs after someone has manually edited the service in Cloud Run console
  lifecycle {
    ignore_changes = [
      template[0].metadata[0].annotations["client.knative.dev/user-image"],
      template[0].metadata[0].annotations["run.googleapis.com/client-name"],
      template[0].metadata[0].annotations["run.googleapis.com/client-version"],
      template[0].metadata[0].annotations["run.googleapis.com/sandbox"],
      metadata[0].annotations["client.knative.dev/user-image"],
      metadata[0].annotations["run.googleapis.com/client-name"],
      metadata[0].annotations["run.googleapis.com/client-version"],
      metadata[0].annotations["run.googleapis.com/launch-stage"],
      metadata[0].annotations["serving.knative.dev/creator"],
      metadata[0].annotations["serving.knative.dev/lastModifier"],
      metadata[0].annotations["run.googleapis.com/ingress-status"],
      metadata[0].labels["cloud.googleapis.com/location"],
      template[0].spec[0].containers[0].image
    ]
  }

  depends_on = [google_project_service.run_api, google_redis_instance.redis-core, google_sql_database_instance.core, google_artifact_registry_repository.app-service, google_vpc_access_connector.connector]
}

resource "google_cloud_run_service" "web" {
  name = "web"
  location = "us-west1"
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "us-west1-docker.pkg.dev/${var.gcp_project}/web/web:latest"
        # Env variables must be defined at build time for Next.js
        startup_probe {
          initial_delay_seconds = 10
          failure_threshold = 3
          http_get {
            path = "/api/healthcheck"
            port = 3000
          }
        }
        liveness_probe {
          initial_delay_seconds = 10
          failure_threshold = 3
          period_seconds = 360
          http_get {
            path = "/api/healthcheck"
            port = 3000
          }
        }
        ports {
          container_port = 3000
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = "1"
        "autoscaling.knative.dev/maxScale"      = "100"
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
        "client.knative.dev/user-image"           = "us-west1-docker.pkg.dev/${var.gcp_project}/web/web:latest"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  # This addresses an annoying bug where apply hangs after someone has manually edited the service in Cloud Run console
  lifecycle {
    ignore_changes = [
      template[0].metadata[0].annotations["client.knative.dev/user-image"],
      template[0].metadata[0].annotations["run.googleapis.com/client-name"],
      template[0].metadata[0].annotations["run.googleapis.com/client-version"],
      template[0].metadata[0].annotations["run.googleapis.com/sandbox"],
      metadata[0].annotations["client.knative.dev/user-image"],
      metadata[0].annotations["run.googleapis.com/client-name"],
      metadata[0].annotations["run.googleapis.com/client-version"],
      metadata[0].annotations["run.googleapis.com/launch-stage"],
      metadata[0].annotations["serving.knative.dev/creator"],
      metadata[0].annotations["serving.knative.dev/lastModifier"],
      metadata[0].annotations["run.googleapis.com/ingress-status"],
      metadata[0].labels["cloud.googleapis.com/location"],
      template[0].spec[0].containers[0].image
    ]
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
# Allow unauthenticated users to invoke the service
# TEMP: Remove this
resource "google_cloud_run_service_iam_member" "run_all_users_service" {
  service  = google_cloud_run_service.app-service.name
  location = google_cloud_run_service.app-service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

// This (and one for app-service) are defined locally in sandbox
// Could not get the correct rights to create this
// Issues with verified domain
# resource "google_cloud_run_domain_mapping" "web" {
#   name     = var.web_domain_mapping
#   location = google_cloud_run_service.web.location
#   metadata {
#     annotations = {
#       "run.googleapis.com/launch-stage" = "BETA"
#     }
#     namespace = var.gcp_project
#   }
#   spec {
#     route_name = google_cloud_run_service.web.name
#   }
# }
