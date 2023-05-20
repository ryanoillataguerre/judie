resource "google_project_service" "vpcaccess_googleapis_com" {
  project = "467740700781"
  service = "vpcaccess.googleapis.com"
}
# terraform import google_project_service.vpcaccess_googleapis_com 467740700781/vpcaccess.googleapis.com
