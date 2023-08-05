
resource "google_cloud_run_service" "default" {
  name                       = var.name
  location                   = var.location
  autogenerate_revision_name = true
  project                    = var.project

  template {
    spec {
      container_concurrency = var.concurrency
      service_account_name  = var.service_account_email
      timeout_seconds       = var.timeout
      containers {
        image = var.image
        resources {
          limits = {
            cpu    = "${var.cpus * 1000}m"
            memory = "${var.memory}Mi"
          }
        }
        # image = "us-west1-docker.pkg.dev/${var.project}/${var.name}/${var.name}:latest"
        # Env variables must be defined at build time for Next.js
        startup_probe {
          initial_delay_seconds = 10
          failure_threshold     = 3
          http_get {
            path = var.healthcheck_path
            port = var.healthcheck_port
          }
        }
        liveness_probe {
          initial_delay_seconds = 10
          failure_threshold     = 3
          period_seconds        = 360
          http_get {
            path = var.healthcheck_path
            port = var.healthcheck_port
          }
        }
        ports {
          name           = var.http2 ? "h2c" : "http1"
          container_port = var.container_port
        }

        # Populate straight environment variables.
        dynamic "env" {
          for_each = [for e in var.env : e if e.value != null]

          content {
            name  = env.value.key
            value = env.value.value
          }
        }


      }
    }
    metadata {
      labels = var.labels

      annotations = merge({
        "run.googleapis.com/cpu-throttling"     = var.cpu_throttling
        "autoscaling.knative.dev/minScale"      = "1"
        "autoscaling.knative.dev/maxScale"      = "${var.max_instances}"
        "client.knative.dev/user-image"         = var.image
        "run.googleapis.com/cloudsql-instances" = join(",", var.cloudsql_connections)
        "run.googleapis.com/ingress"            = var.ingress
        "run.googleapis.com/client-name" = "terraform" },

        # Make into a variable?
        var.vpc_access.connector == null ? {} : {
          "run.googleapis.com/vpc-access-connector" = var.vpc_access.connector
          "run.googleapis.com/vpc-access-egress"    = var.vpc_access.egress
        }


      )
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
      template[0].metadata[0].labels["run.googleapis.com/startupProbeType"],
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

}

resource "google_cloud_run_domain_mapping" "domains" {
  for_each = var.map_domains

  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  name     = each.value

  metadata {
    namespace = google_cloud_run_service.default.project
    annotations = {
      "run.googleapis.com/launch-stage" = local.launch_stage
    }
  }

  spec {
    route_name = google_cloud_run_service.default.name
  }

  lifecycle {
    ignore_changes = [metadata[0]]
  }
}
