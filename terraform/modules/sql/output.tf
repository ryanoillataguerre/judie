output name {
  value = google_sql_database_instance.default.name
  description = "DB instance name"
}
output private_ip_address {
  value = google_sql_database_instance.default.private_ip_address
  description = "DB private IP"
}
output connection_name {
  value = google_sql_database_instance.default.connection_name
  description = "DB cloud sql connector connection name"
}

output db_user_password {
  value = random_password.password.result
}