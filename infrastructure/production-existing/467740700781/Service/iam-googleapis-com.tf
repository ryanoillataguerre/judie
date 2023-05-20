resource "google_project_service" "iam_googleapis_com" {
  project = "467740700781"
  service = "iam.googleapis.com"
}
# terraform import google_project_service.iam_googleapis_com 467740700781/iam.googleapis.com
