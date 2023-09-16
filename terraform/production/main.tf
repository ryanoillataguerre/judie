locals {
  bucket_name = "judie-audio-production"
}

# Enable necessary management APIs
resource "google_project_service" "run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = true
}
resource "google_project_service" "vpcaccess-api" {
  project = var.gcp_project
  service = "vpcaccess.googleapis.com"
}
resource "google_project_service" "sqladmin-api" {
  project = var.gcp_project
  service = "sqladmin.googleapis.com"
}

resource "google_dns_managed_zone" "web-public" {
  dns_name      = "app.judie.io."
  force_destroy = false
  name          = "web-public"
  project       = var.gcp_project
  visibility    = "public"
}

resource "google_dns_managed_zone" "app-service-public" {
  dns_name      = "app-service.judie.io."
  force_destroy = false
  name          = "app-service-public"
  project       = var.gcp_project
  visibility    = "public"
}

# Bucket
module "audio-file-bucket" {
  source = "../modules/bucket"
  name   = local.bucket_name
}

# VPC Network

module "vpc" {
  source                         = "../modules/vpc"
  project                        = var.gcp_project
  name                           = "production"
  region                         = "us-west1"
  access_connector_max_instances = 3
  web_public_dns_zone            = google_dns_managed_zone.web-public.name
  app_service_public_dns_zone    = google_dns_managed_zone.app-service-public.name
}

# Cloud SQL DB

module "sql_db" {
  source               = "../modules/sql"
  project              = var.gcp_project
  db_name              = "core"
  region               = "us-west1"
  db_tier              = "db-g1-small"
  disk_size            = 100
  backups_enabled      = true
  private_network_link = module.vpc.private_network_link
  max_connections      = 1000

  depends_on = [module.vpc]
}

# Redis Instance

module "redis_instance" {
  source             = "../modules/redis"
  project            = var.gcp_project
  region             = "us-west1"
  instance_name      = "core"
  private_network_id = module.vpc.private_network_id

  depends_on = [module.vpc]
}

# Artifact Registry

# Inference Service
module "inference_service_ar_repo" {
  source  = "../modules/ar_repo"
  project = var.gcp_project
  repo_id = "inference-service"
}
# App Service
module "app_service_ar_repo" {
  source  = "../modules/ar_repo"
  project = var.gcp_project
  repo_id = "app-service"
}
# Web
module "web_ar_repo" {
  source  = "../modules/ar_repo"
  project = var.gcp_project
  repo_id = "web"
}

# Cloud Run

# Inference Service
module "inference-service" {
  name     = "inference-service"
  location = "us-west1"

  source = "../modules/cloudrun"

  image = "us-west1-docker.pkg.dev/${var.gcp_project}/inference-service/inference_service:latest"

  # Optional parameters
  allow_public_access = true
  cloudsql_connections = [
    module.sql_db.connection_name
  ]
  concurrency = 80
  cpus        = 1
  env = [
    {
      key   = "DATABASE_URL"
      value = "postgres://postgres:${module.sql_db.db_user_password}@${module.sql_db.private_ip_address}:5432/postgres"
    },
    {
      key   = "OPENAI_API_KEY"
      value = var.env_openai_api_key
    },
    {
      key   = "PINECONE_API_KEY"
      value = var.env_pinecone_api_key
    },
    {
      key   = "PINECONE_ENVIRONMENT"
      value = var.env_pinecone_environment
    },
    {
      key   = "GRPC_PORT"
      value = var.grpc_port
    },
    {
      key   = "GRPC_HEALTH_PORT"
      value = var.grpc_health_port
    },
    {
      key   = "WOLFRAM_APP_ID"
      value = var.wolfram_app_id
    }
  ]
  execution_environment = "gen1"
  http2                 = true
  max_instances         = 50
  memory                = 1024
  container_port        = 443
  project               = var.gcp_project
  vpc_access            = { connector = module.vpc.connector_id, egress = "private-ranges-only" }
  # map_domains           = ["inference-service.judie.io"]
  startup_probe_grpc = [{
    service = "grpc.health.v1.Health"
  }]
  liveness_probe_grpc = [{
    service = "grpc.health.v1.Health"
  }]

  depends_on = [module.vpc.connector_id, module.sql_db.private_ip_address, module.sql_db.db_user_password, module.inference_service_ar_repo]
}

# App Service
module "app-service" {
  name     = "app-service"
  location = "us-west1"

  source = "../modules/cloudrun"

  image = "us-west1-docker.pkg.dev/${var.gcp_project}/app-service/app-service:latest"

  # Optional parameters
  allow_public_access = true
  cloudsql_connections = [
    module.sql_db.connection_name
  ]
  concurrency = 60
  cpus        = 1
  env = [
    {
      key   = "DATABASE_URL"
      value = "postgres://postgres:${module.sql_db.db_user_password}@${module.sql_db.private_ip_address}:5432/postgres"
    },
    {
      key   = "REDIS_HOST"
      value = module.redis_instance.host
    },
    {
      key   = "REDIS_PORT"
      value = "6379"
    },
    {
      key   = "NODE_ENV"
      value = "production"
    },
    {
      key   = "OPENAI_API_KEY"
      value = var.env_openai_api_key
    },
    {
      key   = "PINECONE_API_KEY"
      value = var.env_pinecone_api_key
    },
    {
      key   = "PINECONE_ENVIRONMENT"
      value = var.env_pinecone_environment
    },
    {
      key   = "SESSION_SECRET"
      value = var.env_session_secret
    },
    {
      key   = "STRIPE_WEBHOOK_SECRET"
      value = var.env_stripe_whsec
    },
    {
      key   = "STRIPE_MONTHLY_PRICE_ID"
      value = var.env_stripe_monthly_price_id
    },
    {
      key   = "STRIPE_SK"
      value = var.env_stripe_sk
    },
    {
      key   = "STRIPE_EMPLOYEE_COUPON_ID"
      value = var.env_stripe_employee_coupon_id
    },
    {
      key   = "CUSTOMERIO_API_KEY"
      value = var.env_customerio_api_key
    },
    {
      key   = "CUSTOMERIO_APP_API_KEY"
      value = var.env_customerio_app_api_key
    },
    {
      key   = "CUSTOMERIO_SITE_ID"
      value = var.env_customerio_site_id
    },
    {
      key   = "SEGMENT_WRITE_KEY"
      value = var.env_segment_write_key
    },
    {
      key   = "INFERENCE_SERVICE_URL"
      value = "${trimprefix(module.inference-service.url, "https://")}:443"
    },
    {
      key   = "ELEVENLABS_API_KEY"
      value = var.env_elevenlabs_api_key
    },
    {
      key   = "GCLOUD_BUCKET_NAME"
      value = local.bucket_name
    },
    {
      key   = "PDF_SERVICES_CLIENT_ID"
      value = var.env_pdf_services_client_id
    },
    {
      key   = "PDF_SERVICES_CLIENT_SECRET"
      value = var.env_pdf_services_client_secret
    }
  ]
  execution_environment          = "gen1"
  http2                          = false
  max_instances                  = 50
  memory                         = 512
  container_port                 = 8080
  startup_initial_delay_seconds  = 30
  liveness_initial_delay_seconds = 30
  project                        = var.gcp_project
  vpc_access                     = { connector = module.vpc.connector_id, egress = "private-ranges-only" }
  map_domains                    = ["app-service.judie.io"]
  startup_probe_http = [{
    port = 8080
    path = "/healthcheck"
  }]
  liveness_probe_http = [{
    port = 8080
    path = "/healthcheck"
  }]

  depends_on = [module.vpc, module.sql_db,
    # module.inference-service,
  module.redis_instance, module.app_service_ar_repo]
}

# Web

module "web" {
  name     = "web"
  location = "us-west1"

  source = "../modules/cloudrun"

  image = "us-west1-docker.pkg.dev/${var.gcp_project}/web/web:latest"

  # Optional parameters
  allow_public_access            = true
  cpus                           = 1
  execution_environment          = "gen1"
  http2                          = false
  max_instances                  = 50
  memory                         = 1024
  container_port                 = 3000
  project                        = var.gcp_project
  startup_initial_delay_seconds  = 30
  liveness_initial_delay_seconds = 30
  vpc_access                     = { connector = module.vpc.connector_id, egress = "private-ranges-only" }
  map_domains                    = ["app.judie.io"]

  # Next requires this to be present at build time
  # env = [
  #   {
  #     key   = "NEXT_PUBLIC_SEGMENT_WRITE_KEY"
  #     value = var.env_segment_write_key
  #   }
  # ]

  startup_probe_http = [{
    port = 3000
    path = "/api/healthcheck"
  }]
  liveness_probe_http = [{
    port = 3000
    path = "/api/healthcheck"
  }]

  depends_on = [module.vpc, module.sql_db,
    # module.inference-service,
  module.app-service]
}

# Secrets
resource "google_secret_manager_secret" "tf-vars_secret" {
  secret_id = "prod_tf_vars"

  replication{
    automatic = true
  }
}