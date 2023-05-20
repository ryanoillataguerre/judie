resource "google_compute_instance" "meilisearch" {
  boot_disk {
    auto_delete = true
    device_name = "meilisearch"

    initialize_params {
      image = "https://www.googleapis.com/compute/beta/projects/debian-cloud/global/images/debian-11-bullseye-v20230411"
      size  = 10
      type  = "pd-balanced"
    }

    mode   = "READ_WRITE"
    source = "https://www.googleapis.com/compute/v1/projects/production-382518/zones/us-west2-a/disks/meilisearch"
  }

  confidential_instance_config {
    enable_confidential_compute = false
  }

  machine_type = "e2-small"

  metadata = {
    ssh-keys = "ryan:ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBKU14wEcDNk3Ps2+hUdAW93WVDOcbGQIJvD355SyY+e+GcD/zpmpdT1T0LuCYp+9hcwnv8QuFU9vJEXKo9abOG8= google-ssh {\"userName\":\"ryan@judie.io\",\"expireOn\":\"2023-05-02T04:44:13+0000\"}\nryan:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCSHFNrJaKUV5ZcD3VliLW/Z6Z2Nrr37BFuefLIk/AEdrsmAuWasz5IYvPW3wsYCC8ykM2zXc1uQQFTIkIghHNxK/hPBeZHsVzcSsx4y86XUd/Q2Vs+7g8Cfj5HFsPEh6dsJV+LAHqEFjYzl7hmV/6jyj8VrmlgNgtQCbMT3xhv+lSO2psK9TkMNYjkWkARosGwwYNaENg92vtGtBp1FaLjVu2ebcboIXVS7Y3YE0IPcXgsl2Kjnda+ZjHtnJ9xKjRRNm8q/g/RTLdrdt66NwTZTJgyNfFCTiRyqfRGQoDC+jk961h7jtP8kzIBiS8yXNwVpAluuwkfacMJQ/s2DGeT google-ssh {\"userName\":\"ryan@judie.io\",\"expireOn\":\"2023-05-02T04:44:27+0000\"}\nryan:ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBORZyQcW0Eu5rBymm5xxJn4gpg9p0qzE++33apkI9g12DWSu+iM3TooAQWjJ/HlS1xcVotOvuLV/9BUtr5VBJBQ= google-ssh {\"userName\":\"ryan@judie.io\",\"expireOn\":\"2023-05-02T04:45:10+0000\"}\nryan:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAHi0ilmzjwhA1ejrNCty2bdEPXEOZZc7UwVPJJFQxhOStm/IHRyJ1OqaZlnpGgeg1t4dgyEg2sVNM9d2flgUD2ET8mfg7DfyDkYL8o9JX9k2w7iM1igv/dyAlctFZUFbJd7VESqPk3STflQemnYX0dAW/BMF3Jb8MAcZGBWwevogoWJh78IuXnx7nXMiqeM2hdJ4I09Dvk9Xh0FlHeYmFzFkLBHZ/QUumJhXabpwRwVNTmu7D0OYaEKBCiD63nNO9Cj+nLiZaWgJ5w1KYDbIYEOAE0HPBSxd4lOtF4Za7ZhBqfOTSd4gT33umg1YdXkemOEQI9g5uz/BmhgB8Yf+jmM= google-ssh {\"userName\":\"ryan@judie.io\",\"expireOn\":\"2023-05-02T04:45:24+0000\"}"
  }

  name = "meilisearch"

  network_interface {
    access_config {
      network_tier = "PREMIUM"
    }

    network            = "https://www.googleapis.com/compute/v1/projects/production-382518/global/networks/default"
    network_ip         = "10.168.0.2"
    stack_type         = "IPV4_ONLY"
    subnetwork         = "https://www.googleapis.com/compute/v1/projects/production-382518/regions/us-west2/subnetworks/default"
    subnetwork_project = "production-382518"
  }

  project = "production-382518"

  reservation_affinity {
    type = "ANY_RESERVATION"
  }

  scheduling {
    automatic_restart   = true
    on_host_maintenance = "MIGRATE"
    provisioning_model  = "STANDARD"
  }

  service_account {
    email  = "467740700781-compute@developer.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/devstorage.read_only", "https://www.googleapis.com/auth/logging.write", "https://www.googleapis.com/auth/monitoring.write", "https://www.googleapis.com/auth/service.management.readonly", "https://www.googleapis.com/auth/servicecontrol", "https://www.googleapis.com/auth/trace.append"]
  }

  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_vtpm                 = true
  }

  tags = ["http-server", "https-server"]
  zone = "us-west2-a"
}
# terraform import google_compute_instance.meilisearch projects/production-382518/zones/us-west2-a/instances/meilisearch
