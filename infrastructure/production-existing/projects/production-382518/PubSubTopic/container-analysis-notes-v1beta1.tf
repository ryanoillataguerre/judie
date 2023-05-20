resource "google_pubsub_topic" "container_analysis_notes_v1beta1" {
  name    = "container-analysis-notes-v1beta1"
  project = "production-382518"
}
# terraform import google_pubsub_topic.container_analysis_notes_v1beta1 projects/production-382518/topics/container-analysis-notes-v1beta1
