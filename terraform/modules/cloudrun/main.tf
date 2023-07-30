module "cloudrun_service" {
  resource "google_cloud_run_service" {
    name = var.service_name
    location = var.location
    autogenerate_revision_name = true

    template {
      spec {
        containers {
          image = "us-west1-docker.pkg.dev/${var.gcp_project}/${var.service_name}/${var.service_name}:latest"
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
          "autoscaling.knative.dev/maxScale"      = "${var.max_scale}"
          "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.id
          # Make into a variable?
          "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
          "client.knative.dev/user-image"           = "us-west1-docker.pkg.dev/${var.gcp_project}/${var.service_name}/${var.service_name}:latest"
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
}
