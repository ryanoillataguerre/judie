resource "google_project_service" "redis_googleapis_com" {
  project = "467740700781"
  service = "redis.googleapis.com"
}
# terraform import google_project_service.redis_googleapis_com 467740700781/redis.googleapis.com
