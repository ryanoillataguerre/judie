# Enable necessary management APIs
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"

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

# Store backend state in Cloud Storage

module "backend-bucket" {
  source = "../modules/bucket"
  name   = "judie-tfstate-sandbox"
}

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

# VPC Network

module "vpc" {
  source                         = "../modules/vpc"
  project                        = var.gcp_project
  name                           = "sandbox"
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
  db_tier              = "db-f1-micro"
  disk_size            = 50
  backups_enabled      = false
  private_network_link = module.vpc.private_network_link

  depends_on = [module.vpc]
}

# Redis Instance

module "redis_instance" {
  source             = "../modules/redis"
  project            = var.gcp_project
  region             = "us-west1"
  instance_name      = "redis-core"
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
# Temp removed while image is set up
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
  memory                = 512
  container_port        = 443
  project               = var.gcp_project
  vpc_access            = { connector = module.vpc.connector_id }
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
      value = "sandbox"
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
      key   = "INFERENCE_SERVICE_URL"
      value = "${trimprefix(module.inference-service.url, "https://")}:443"
    }
  ]
  execution_environment = "gen1"
  http2                 = false
  max_instances         = 50
  memory                = 512
  container_port        = 8080
  project               = var.gcp_project
  vpc_access            = { connector = module.vpc.connector_id }
  startup_probe_http = [{
    port = 8080
    path = "/healthcheck"
  }]
  liveness_probe_http = [{
    port = 8080
    path = "/healthcheck"
  }]

  depends_on = [module.vpc, module.sql_db, module.inference-service, module.redis_instance, module.app_service_ar_repo]
}

# Web

module "web" {
  name     = "web"
  location = "us-west1"

  source = "../modules/cloudrun"

  image = "us-west1-docker.pkg.dev/${var.gcp_project}/web/web:latest"

  # Optional parameters
  allow_public_access   = true
  cpus                  = 1
  execution_environment = "gen1"
  http2                 = false
  max_instances         = 50
  memory                = 1024
  container_port        = 3000
  project               = var.gcp_project
  vpc_access            = { connector = module.vpc.connector_id }

  startup_probe_http = [{
    port = 8080
    path = "/api/healthcheck"
  }]
  liveness_probe_http = [{
    port = 8080
    path = "/api/healthcheck"
  }]

  depends_on = [module.vpc, module.sql_db, module.inference-service, module.app-service]
}
