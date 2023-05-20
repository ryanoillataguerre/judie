resource "google_project_service" "cloudtrace_googleapis_com" {
  project = "467740700781"
  service = "cloudtrace.googleapis.com"
}
# terraform import google_project_service.cloudtrace_googleapis_com 467740700781/cloudtrace.googleapis.com
