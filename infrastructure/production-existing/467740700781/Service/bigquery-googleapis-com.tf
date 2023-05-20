resource "google_project_service" "bigquery_googleapis_com" {
  project = "467740700781"
  service = "bigquery.googleapis.com"
}
# terraform import google_project_service.bigquery_googleapis_com 467740700781/bigquery.googleapis.com
