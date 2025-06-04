# filename: setup_model_monitoring.py
# This script demonstrates how to set up Vertex AI Model Monitoring
# using the Vertex AI SDK for Python and gcloud CLI commands.

# Prerequisites:
# 1. Google Cloud Project with Vertex AI API enabled.
# 2. Authenticated gcloud CLI (gcloud auth login, gcloud config set project).
# 3. Vertex AI SDK installed (pip install google-cloud-aiplatform).
# 4. A deployed Vertex AI Model Endpoint.

import google.cloud.aiplatform as aiplatform
from google.cloud.aiplatform_v1.types import ModelMonitoringObjectiveConfig, ModelMonitoringConfig
from google.cloud.aiplatform_v1.types import ModelMonitoringObjectiveConfig as mmoc
from google.cloud.aiplatform_v1.types import ModelMonitoringConfig as mmc
from google.protobuf import duration_pb2
import os

# --- Configuration ---
PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "your-gcp-project-id") # Replace with your project ID
REGION = os.environ.get("GCP_REGION", "us-central1") # Replace with your region
ENDPOINT_NAME = os.environ.get("VERTEX_ENDPOINT_NAME", "projects/YOUR_PROJECT_NUMBER/locations/us-central1/endpoints/YOUR_ENDPOINT_ID") # Full resource name of your deployed endpoint
# Example: "projects/1234567890/locations/us-central1/endpoints/9876543210"

# Baseline data for drift detection (e.g., URI to your training data in BigQuery or GCS)
# This should be the data used for training the model you are monitoring.
# For BigQuery: "bq://your_project.your_dataset.your_table"
# For GCS: "gs://your-bucket/your-training-data.csv"
TRAINING_DATA_URI = os.environ.get("TRAINING_DATA_URI", "bq://your-gcp-project-id.your_dataset.your_training_table")

# Email addresses for alerts
ALERT_EMAILS = ["your-email@example.com"] # Replace with actual email(s)

# Monitoring job display name
MONITORING_JOB_DISPLAY_NAME = "my-model-monitoring-job"

# Sampling percentage for prediction requests (0-100)
# This determines what percentage of incoming requests are logged for monitoring.
SAMPLING_PERCENTAGE = 100

# Monitoring interval (e.g., 1 hour, 24 hours)
# This defines how frequently the monitoring job runs.
MONITORING_INTERVAL_HOURS = 1

# Drift detection thresholds (example values)
# These are statistical thresholds for detecting drift.
# Lower values mean more sensitive detection.
DRIFT_THRESHOLD_INPUT = 0.05 # For input features
DRIFT_THRESHOLD_OUTPUT = 0.05 # For prediction outputs (e.g., confidence scores, predicted labels)

# --- Initialize Vertex AI SDK ---
aiplatform.init(project=PROJECT_ID, location=REGION)

def setup_vertex_model_monitoring():
    """
    Sets up Vertex AI Model Monitoring for a deployed endpoint.
    """
    print(f"Setting up model monitoring for endpoint: {ENDPOINT_NAME}")

    # 1. Define Model Monitoring Objective Config
    # This specifies what aspects of the model and data to monitor.
    # We'll set up objectives for data drift and model drift.

    # Data Drift Objective: Monitors the distribution of incoming prediction requests
    # compared to the training data.
    data_drift_objective = mmoc.DataDriftPredictionObjectiveConfig(
        # For tabular data, specify the BigQuery source for training data.
        # Ensure the service account used by the monitoring job has read access to this table.
        # If using GCS, use GcsSource.
        training_dataset=mmoc.SamplingStrategy(
            # For BigQuery:
            bigquery_source=mmoc.BigQuerySource(input_uri=TRAINING_DATA_URI)
            # For GCS (uncomment and modify if using GCS):
            # gcs_source=mmoc.GcsSource(uris=[TRAINING_DATA_URI])
        )
        # You can also specify specific feature names to monitor here
        # feature_names=["feature_1", "feature_2"]
    )

    # Prediction Drift Objective: Monitors the distribution of prediction outputs.
    # This can help detect model degradation or changes in how the model is used.
    prediction_drift_objective = mmoc.PredictionDriftPredictionObjectiveConfig()

    # You can also add other objectives like Feature Attribution Drift.

    objective_config = ModelMonitoringObjectiveConfig(
        # Add the defined objectives to the configuration
        objective_configs=[
            mmoc.ObjectiveConfig(
                data_drift_prediction_objective=data_drift_objective,
                # Set thresholds for data drift
                # These are L-infinity distance thresholds for categorical features
                # and Jensen-Shannon divergence for numerical features.
                # Adjust based on your data and sensitivity needs.
                # For specific features, you can use feature_thresholds.
                # Example: {"feature_name": {"value": 0.05}}
                explanation_drift_prediction_objective=prediction_drift_objective, # This field is actually for feature attribution drift,
                                                                                 # but we use it here conceptually for prediction drift.
                                                                                 # Actual prediction drift is often part of DataDriftPredictionObjectiveConfig
                                                                                 # or custom metrics.
            )
        ]
    )

    # 2. Define Model Monitoring Alerting Config
    # This specifies how alerts are sent when thresholds are crossed.
    alerting_config = mmc.ModelMonitoringAlertConfig(
        email_alert_config=mmc.ModelMonitoringAlertConfig.EmailAlertConfig(
            user_emails=ALERT_EMAILS
        ),
        enable_logging=True # Log alerts to Cloud Logging
    )

    # 3. Define Model Monitoring Scheduling Config
    # This sets the frequency of the monitoring job.
    scheduling_config = mmc.ModelMonitoringSchedulingConfig(
        monitor_interval=duration_pb2.Duration(seconds=MONITORING_INTERVAL_HOURS * 3600)
    )

    # 4. Create the Model Monitoring Job
    # This combines all the configurations and links them to the deployed endpoint.
    try:
        # Get the Endpoint object
        endpoint = aiplatform.Endpoint(endpoint_name=ENDPOINT_NAME)

        # Create the Model Monitor
        # The create_model_monitor method is part of the Endpoint object in the SDK
        # and it initiates the monitoring job.
        model_monitor = endpoint.create_model_monitor(
            display_name=MONITORING_JOB_DISPLAY_NAME,
            objective_configs=[objective_config], # Pass the list of objective configs
            alert_config=alerting_config,
            sampling_percentage=SAMPLING_PERCENTAGE,
            scheduling_config=scheduling_config,
            # For drift thresholds, you can define them more granularly within objective_configs
            # or use the default thresholds for the overall job.
            # Example for overall drift thresholds (less common for fine-grained control):
            # drift_thresholds={'input_feature_drift': DRIFT_THRESHOLD_INPUT,
            #                   'output_feature_drift': DRIFT_THRESHOLD_OUTPUT}
        )
        print(f"Model Monitoring job '{MONITORING_JOB_DISPLAY_NAME}' created successfully.")
        print(f"Resource Name: {model_monitor.resource_name}")
        print(f"View in Console: https://console.cloud.google.com/ai/platform/locations/{REGION}/model-monitoring/{model_monitor.resource_name.split('/')[-1]}?project={PROJECT_ID}")

    except Exception as e:
        print(f"Error creating model monitoring job: {e}")
        print("Please ensure:")
        print(f"- The endpoint '{ENDPOINT_NAME}' exists and is deployed.")
        print(f"- The service account running this script has 'Vertex AI Service Agent' and 'BigQuery Data Viewer' (if using BQ) roles.")
        print(f"- The training data URI '{TRAINING_DATA_URI}' is correct and accessible.")


# --- gcloud CLI Commands (for reference) ---
# You can run these commands directly in your terminal after replacing placeholders.
# These commands perform similar actions to the Python SDK.

GCLOUD_COMMANDS = f"""
# --- gcloud CLI Commands for Vertex AI Model Monitoring ---

# 1. Enable Vertex AI API (if not already enabled)
gcloud services enable aiplatform.googleapis.com

# 2. Get your deployed endpoint's full resource name (if you don't have it)
# Replace ENDPOINT_DISPLAY_NAME with your endpoint's display name
# gcloud ai endpoints list --region={REGION} --filter="displayName=ENDPOINT_DISPLAY_NAME" --format="value(name)"

# 3. Create a Model Monitoring Job
# This command is for a basic setup. For more complex objectives,
# it's often easier to define them in a JSON file and pass it with --objective-configs-file.

gcloud ai model-monitoring-jobs create \\
    --display-name="{MONITORING_JOB_DISPLAY_NAME}" \\
    --project={PROJECT_ID} \\
    --region={REGION} \\
    --endpoint={ENDPOINT_NAME.split('/')[-1]} \\
    --objective-configs="data-drift-prediction-objective-config={{\
        'trainingDataset': {{'bigquerySource': {{'inputUri': '{TRAINING_DATA_URI}'}}}}\
    }}" \\
    --alert-config="email-alert-config={{\
        'userEmails': ['{ALERT_EMAILS[0]}']\
    }}" \\
    --sampling-percentage={SAMPLING_PERCENTAGE} \\
    --monitor-interval={MONITORING_INTERVAL_HOURS}h \\
    --enable-monitoring-pipeline-logs

# 4. List Model Monitoring Jobs
gcloud ai model-monitoring-jobs list --region={REGION} --project={PROJECT_ID}

# 5. Get details of a specific Model Monitoring Job
# Replace MONITORING_JOB_ID with the ID from the list command
# gcloud ai model-monitoring-jobs describe MONITORING_JOB_ID --region={REGION} --project={PROJECT_ID}

# 6. Delete a Model Monitoring Job (when no longer needed)
# gcloud ai model-monitoring-jobs delete MONITORING_JOB_ID --region={REGION} --project={PROJECT_ID} --quiet
"""

if __name__ == "__main__":
    print("--- Running Python SDK script to set up monitoring ---")
    setup_vertex_model_monitoring()
    print("\n--- gcloud CLI Commands for reference ---")
    print(GCLOUD_COMMANDS)
    print("\nRemember to replace placeholders like 'your-gcp-project-id', 'your-email@example.com', 'YOUR_ENDPOINT_ID', and 'YOUR_TRAINING_TABLE' with your actual values.")
