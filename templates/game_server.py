from google.cloud import aiplatform, container_v1, agones_v1, storage
import time
import uuid

# --- Configuration ---
PROJECT_ID = "project-id"
REGION = "region" 
GKE_CLUSTER_NAME = "cluster-name"
GKE_LOCATION = "zone"
AGONES_NAMESPACE = "agones-system"
MODEL_DISPLAY_NAME = "adaptive-behavior-model"
CONTAINER_URI = "docker-image-uri"
DATASET_ID = "dataset-id"
BUCKET_NAME = "bucket-name"

# --- Vertex AI Custom Training ---
def train_adaptive_behavior_model():
    aiplatform.init(project=PROJECT_ID, location=REGION)

    job = aiplatform.CustomContainerTrainingJob(
        display_name="adaptive-behavior-training",
        container_uri=CONTAINER_URI,
        model_serving_container_image_uri=CONTAINER_URI,
    )

    model = job.run(
        dataset=DATASET_ID,
        model_display_name=MODEL_DISPLAY_NAME,
        sync=True,
    )

    print(f"Trained model: {model.resource_name}")
    return model.resource_name

# --- GKE and Agones Setup ---
def get_gke_cluster():
    client = container_v1.ClusterManagerClient()
    name = f"projects/{PROJECT_ID}/locations/{GKE_LOCATION}/clusters/{GKE_CLUSTER_NAME}"
    return client.get_cluster(name=name)

def create_game_server(model_resource_name):
    agones_client = agones_v1.AgonesClient()

    game_server_spec = {
        "metadata": {"generate_name": "adaptive-server-"},
        "spec": {
            "ports": [{"name": "default", "containerPort": 7654}], 
            "template": {
                "spec":    {
                    "containers": [{
                        "name": "game-server",
                        "image": "game-server-image",
                        "ports": [{"containerPort": 7654}]
                        "env": [
                            {"name": "MODEL_RESOURCE_NAME", "value": model_resource_name},
                            {"name": "BUCKET_NAME", "value": BUCKET_NAME}
                         ],
                        }
                    ],    
                }
            }
        }
    }
    return agones_client.crreate_namespaced_game_server(
        parent=f"projects/{PROJECT_ID}/locations/{REGION}/namespaces/{AGONES_NAMESPACE}",
        game_server=game_server_spec,       
    )

def get_game_server_address(game_server_name):
    agones_client = agones_v1.AgonesClient()
    game_server = agones_client.get_namespaced_game_server(
        name = game_server_name, 
        parent = f"projects/{PROJECT_ID}/locations/{REGION}/namespaces/{AGONES_NAMESPACE}")
    return game_server.status.address, game_server.status.ports[0].port

# --- AI Adaptive Behavior Logic (A splash of) ---
def process_game_state(game_state, model_resource_name):
    # store the game state in cloud storage
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(f"game_state/{uuid.uuid4()}.json")
    blob.upload_from_string(game_state)

    # make prediction using the vertex ai model
    aiplatform_client = aiplatform.gapit.PredictionServiceClient(client_options={"api_endpoint": f"{REGION}-aiplatform.googleapis.com"})
    endpoint = aiplatform_client.endpoint_path(
        project=PROJECT_ID, location=REGION, endpoint=model_resource_name.split('/models/')[0].replace('models', 'endpoints')
    )
    instance = {"content": game_state}
    prediction_request = {"endpoint": endpoint, "instances": [instance]}
    response = aiplatform_client_predict(request=prediction_request)

    # adapt game behavior based on prediction
    prediction = response.predictions[0]

    # implement game logic that uses the prediction to modify game parameters
    adapted_behavior = prediction

    return adapted_behavior

# --- Main ---    
if __name__ == "__main__":
    model_name = train_adaptive_behavior_model()
    game_server = create_game_server(model_name)
    print(f"Game server created: {game_server.name}")
    time.sleep(60)
    address, port = get_game_server_address(game_server.name)
    print(f"Game server address: {address}:{port}")

# simulated Game Loop
game_state = '{"player_position": [10, 20], "enemy_count": 5}'
adapted_behavor = process_game_state(game_state, model_name)
print(f"Adapted behavior: {adapted_behavior}")
#--- game loop ---