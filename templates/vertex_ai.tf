# configure google cloud provider
terraform{
    requried_providers{
        google = {
            source = hashicorp/google"
            version = "~> 4.0" # or latest compatible version
        }
    }
}

provider "google" { 
    project = var.project_id
    region = var.region
}

#define variables 
variable "project_id" {
    description = "The GCP project id"
    type = string
}

variable "region" {
    description = "The GCP region"
    type = string
    default= "us-central1" #or desired
}

variable "bucket_name" {
    description = "The GCS bucket for vertex ai artifacts"
    type = string
}

variable "display_name" {
    description = "Display name for vertex ai model"
    type = string
    default= "my-vertex-ai-model"
}

variable "model_container_image_uri" {
    description = "The container image uri for the model"
    type = string
}

variable "endpoint_display_name" {
    description = "The display name for vertex ai endpoint"
    type = string
    default= "my-vertext-ai-endpoint" 
}


# create a GCS bucket for vertex ai artifacts
resource "google_storage_bucket" "vertex_ai_bucket" {
    name = var.bucket_name
    location = var.region
    storage_class="STANDARD"
    force_destroy = true # dev only remove for production
    uniform_bucket_level_access=true
}

# create vertex ai model
resource "google_vertex_ai_model" "model" {
    name
        display_name 
            container {
                image = var.model_container_image_uri
            }
            # add other model configurations
            # ...
}

# create vertex ai endpoint
resource "google_vertex_ai_endpoint" "endpoint" {
    name = var.endpoint_display_name
    display_name = var.endpoint_display_name
    # add other endpoint configurations
    # ...
}

# deploy the model to the endpoint
resource "google_vertext_ai_endpoint_deployment" "deployment" {
    endpoint = google_vertex_ai_endpoint.endpoint.id
    model = google_vertex_ai_model.model.id
    deployed_model {
        display_name = "deployed_model"
        dedicated_resources {
            machine_spec{
                machine_type = "n1-standard-4" # or desired
            }
            min_replica_count = 1
            max_replica_count = 1
        }
    }
    traffic_split{
    "0" = 100
    }
}

# Outputs
output "model_id" {
    value = "google_vertex_ai_model.model_id"
}

output "endpoint_id" {
    value = "google_vertex_ai_endpoint.endpoint_id"
}

output "bucket_id" {
    value = "google_storage_bucket.vertex_ai_bucket.id"
}



