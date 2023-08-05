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
        ports {
          name           = var.http2 ? "h2c" : "http1"
          container_port = var.container_port
        }

        # Populate straight environment variables.
        dynamic "env" {
          for_each = var.env

          content {
            name  = env.value.key
            value = env.value.value
          }
        }
        startup_probe {
          initial_delay_seconds = 10
          failure_threshold     = 3
          period_seconds        = 60

          dynamic "http_get" {
            for_each = var.startup_probe_http
            content {
              port = http_get.value.port
              path = http_get.value.path
            }
          }
          dynamic "grpc" {
            for_each = var.startup_probe_grpc
            content {
              service = grpc.value.service
            }
          }
        }
        liveness_probe {
          initial_delay_seconds = 10
          failure_threshold     = 3
          period_seconds        = 360

          dynamic "http_get" {
            for_each = var.liveness_probe_http
            content {
              port = http_get.value.port
              path = http_get.value.path
            }
          }
          dynamic "grpc" {
            for_each = var.liveness_probe_grpc
            content {
              service = grpc.value.service
            }
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
        # "run.googleapis.com/ingress"               = var.ingress
        "run.googleapis.com/client-name"           = "terraform",
        "run.googleapis.com/execution-environment" = var.execution_environment
        },
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

resource "google_cloud_run_service_iam_member" "public_access" {
  count    = var.allow_public_access ? 1 : 0
  service  = google_cloud_run_service.default.name
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "domains" {
  for_each = var.map_domains

  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  name     = each.value

  metadata {
    namespace = google_cloud_run_service.default.project
    # annotations = {
    #   "run.googleapis.com/launch-stage" = var.launch_stage
    # }
  }

  spec {
    route_name = google_cloud_run_service.default.name
  }

  lifecycle {
    ignore_changes = [metadata[0]]
  }
}
