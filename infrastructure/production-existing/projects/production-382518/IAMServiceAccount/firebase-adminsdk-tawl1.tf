resource "google_service_account" "firebase_adminsdk_tawl1" {
  account_id   = "firebase-adminsdk-tawl1"
  description  = "Firebase Admin SDK Service Agent"
  display_name = "firebase-adminsdk"
  project      = "production-382518"
}
# terraform import google_service_account.firebase_adminsdk_tawl1 projects/production-382518/serviceAccounts/firebase-adminsdk-tawl1@production-382518.iam.gserviceaccount.com
