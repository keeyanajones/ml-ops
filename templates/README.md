# Templates


## 1. Vertex AI Pipeline (Kubeflow Pipelines YAML)

This template provides a conceptual Kubeflow Pipelines YAML definition for a Vertex AI Pipeline. It outlines the typical stages of an MLOps pipeline, including data processing, model training, evaluation, and conditional deployment.

This YAML is designed to be illustrative. In a real-world scenario, each component would correspond to a Python function or a Docker image that performs the specific task, and actual parameters would be passed.

## 2. Gemini Prompt Engineering Cheat Sheet for MLOps

This cheat sheet provides practical examples and strategies for crafting effective prompts for Gemini within an MLOps context. The goal is to leverage Gemini's capabilities for tasks ranging from data analysis and code generation to troubleshooting and documentation, making your MLOps workflows more efficient.

### General Principles for MLOps Prompts:

- Be Specific and Contextual: Provide all necessary details (e.g., data schema, error messages, target language, cloud service).
- Define Roles/Persona: Tell Gemini what role to adopt (e.g., "Act as a Python expert," "You are an MLOps engineer").
- Specify Output Format: Clearly state the desired output (e.g., "JSON," "Python code," "Markdown table," "YAML").
- Provide Examples (Few-shot): If possible, give one or two examples of input/output to guide Gemini.
- Iterate and Refine: Start broad, then narrow down the prompt based on initial responses.
- Break Down Complex Tasks: For multi-step problems, break them into smaller, manageable prompts.

Prompt Categories & Examples:

1. Data Analysis & Understanding

   - Task: Understand dataset characteristics, suggest cleaning steps.

    Prompt Example:

    "I have a CSV dataset with columns: 'customer_id', 'age', 'income', 'num_purchases', 'last_purchase_date'.
    Describe potential data quality issues for each column (e.g., missing values, outliers, incorrect data types).
    Suggest Python (Pandas) code snippets to identify and address these issues.
    
   - Output: Markdown table for issues, then Python code blocks."

   - Task: Generate synthetic data for testing.

    Prompt Example:

    "Generate 10 rows of synthetic customer data in JSON format.
    Columns: 'customer_id' (unique int), 'name' (string), 'email' (valid email format), 'signup_date' (YYYY-MM-DD), 'is_premium' (boolean).
    Ensure 'signup_date' is within the last 6 months.
   
   - Output: JSON array."

2. Code Generation & Scripting

   - Task: Generate a Vertex AI Pipeline component.

   - Prompt Example:

    "Write a Python function for a Kubeflow Pipelines component.
    This component should take a GCS URI of a CSV file, load it into a Pandas DataFrame, perform min-max scaling on 'age' and 'income' columns, and save the transformed DataFrame back to a new GCS URI as a Parquet file.
    Use `google-cloud-storage` and `pandas`.
    Include necessary imports and type hints.
    
   - Output: Python code block."

   - Task: Write a gcloud command for model deployment.

    Prompt Example:

    "Provide a `gcloud` CLI command to deploy a Vertex AI Model.
    The model ID is 'projects/my-project/locations/us-central1/models/12345'.
    Deploy it to a new endpoint named 'my-inference-endpoint'.
    Allocate 2 n1-standard-4 machine types.
    
   - Output: Single `gcloud` command."

3. Troubleshooting & Debugging

   - Task: Explain an error message.

   - Prompt Example:

    "I'm getting the following error in my Vertex AI Pipeline:
    `google.api_core.exceptions.InvalidArgument: 400 Request contains an invalid argument. The model_id 'my-model' does not exist.`

    What does this error mean, and what are the most likely causes and solutions?
   
   - Output: Bullet points for causes and solutions."

   - Task: Debug a Python script.

    Prompt Example:

    "Analyze the following Python script for potential bugs related to file paths or data loading.
    ```python
    import pandas as pd
    import os

    def load_data(file_path):
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return None
        df = pd.read_csv(file_path)
        return df

    data_uri = "gs://my-bucket/data/input.csv"
    df = load_data(data_uri)
    if df is not None:
        print(df.head())
    ```
    Suggest improvements or common pitfalls for GCS paths.
   
   - Output: Explanation and corrected code."

4. Documentation & Explanations

    - Task: Generate documentation for a pipeline component.

    Prompt Example:

    "Write a docstring for a Python function that serves as a Kubeflow Pipelines component.
    The function `train_model(project_id: str, data_uri: str, model_output_uri: str)` trains a simple scikit-learn Logistic Regression model using data from `data_uri` and saves the serialized model to `model_output_uri`.
    
    - Output: Python docstring adhering to Google style."

    - Task: Explain an MLOps concept.

    Prompt Example:

    "Explain the concept of 'Data Drift' in MLOps.
    What are its causes, why is it important to monitor, and how can Vertex AI help detect it?
    
    - Output: Concise, clear explanation in Markdown."

5. Infrastructure & Configuration

    - Task: Generate a Cloud Build configuration.

    - Prompt Example:

    "Create a `cloudbuild.yaml` file for a CI/CD pipeline for a Python ML project.
    Steps should include:
    1.  Build a Docker image for a training component.
    2.  Push the image to Google Container Registry (GCR).
    3.  Trigger a Vertex AI Pipeline job.
    
    Use placeholder values for project ID, image name, and pipeline name.
   
    - Output: YAML code block."

    - Task: Define monitoring alerts.

    Prompt Example:

    "Suggest a set of monitoring alerts for a deployed Vertex AI Model Endpoint.
    Consider alerts for:
    -   High prediction latency (> 500ms).
    -   High error rate (> 1%).
    -   Significant data drift (e.g., L-infinity distance > 0.1 for a specific feature).
   
    For each, suggest the metric name and a threshold.
   
   - Output: Markdown list."

By following these principles and adapting these examples, you can effectively leverage Gemini to accelerate various tasks within your MLOps workflows on Vertex AI. 

## 3. Vertex AI Model Monitoring Setup Script (Python and gcloud)

This template provides Python and gcloud CLI commands to set up Vertex AI Model Monitoring. This is a crucial step after model deployment to ensure your model's performance and data quality in production.


## 4. Basic CI/CD Workflow for Vertex AI (Cloud Build / GitHub Actions)

This template provides conceptual YAML configurations for a basic CI/CD workflow, demonstrating how code changes can trigger automated builds, tests, and deployment steps for an MLOps project using either Google Cloud Build or GitHub Actions.

### Basic CI/CD Workflow for Vertex AI MLOps

This template outlines a basic Continuous Integration/Continuous Delivery (CI/CD) workflow for an MLOps project on Google Cloud, specifically integrating with Vertex AI. It shows how code changes (e.g., to a model training script or pipeline definition) can trigger automated processes.

We'll provide conceptual YAML for both Google Cloud Build and GitHub Actions.

1. Google Cloud Build Workflow (cloudbuild.yaml)

Google Cloud Build is a serverless CI/CD platform that executes your builds on Google Cloud infrastructure. It's tightly integrated with other Google Cloud services.

This cloudbuild.yaml assumes your repository contains:

   - trainer/ directory with Dockerfile and main.py (your model training code).
   - pipeline/ directory with pipeline.py (your Kubeflow pipeline definition).

 ``` yaml
# filename: cloudbuild.yaml
# This Cloud Build configuration defines a CI/CD pipeline for an MLOps project.

# Variables (can be set in Cloud Build triggers or as default values)
_PROJECT_ID: your-gcp-project-id
_REGION: us-central1
_TRAINER_IMAGE_NAME: gcr.io/${_PROJECT_ID}/ml-trainer:latest
_PIPELINE_NAME: my-mlops-pipeline
_DATA_SOURCE_URI: gs://your-bucket/raw_data/

steps:
  # Step 1: Build the Docker image for the model training component
  # This image will contain your model training code and its dependencies.
  ``` yaml
  - id: 'Build Trainer Image'
    name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '${_TRAINER_IMAGE_NAME}'
      - './trainer' # Path to your Dockerfile and training code
    waitFor: ['-'] # Start immediately

  # Step 2: Push the Docker image to Google Container Registry (GCR)

- id: 'Push Trainer Image'
    name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '${_TRAINER_IMAGE_NAME}'
    waitFor: ['Build Trainer Image'] # Wait for image build to complete

  # Step 3: Compile the Kubeflow Pipeline
  # This step uses a Python environment to compile your KFP pipeline definition
  # into a JSON or YAML file that Vertex AI Pipelines can execute.

  - id: 'Compile Pipeline'
    name: 'python' # Or a custom builder with KFP SDK installed
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        pip install kfp google-cloud-aiplatform # Install necessary SDKs
        python pipeline/pipeline.py --output_file pipeline.json # Your pipeline definition script
    waitFor: ['Push Trainer Image'] # Can run in parallel with image push if pipeline doesn't depend on it

  # Step 4: Upload the compiled pipeline to Cloud Storage
 
  - id: 'Upload Pipeline'
    name: 'gcr.io/cloud-builders/gsutil'
    args:
      - 'cp'
      - 'pipeline.json'
      - 'gs://${_PROJECT_ID}-vertex-pipelines/compiled_pipelines/${_PIPELINE_NAME}.json'
    waitFor: ['Compile Pipeline']

  # Step 5: Trigger the Vertex AI Pipeline Run
  # This step uses the gcloud CLI to start a new run of your Vertex AI Pipeline.

  - id: 'Trigger Vertex AI Pipeline'
    name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'ai'
      - 'pipelines'
      - 'runs'
      - 'create'
      - '--display-name=${_PIPELINE_NAME}-run-$BUILD_ID' # Unique name for each run
      - '--pipeline-root=gs://${_PROJECT_ID}-vertex-pipelines/pipeline_root' # Root for pipeline artifacts
      - '--template-path=gs://${_PROJECT_ID}-vertex-pipelines/compiled_pipelines/${_PIPELINE_NAME}.json'
      - '--project=${_PROJECT_ID}'
      - '--location=${_REGION}'
      - '--parameter-values=project_id=${_PROJECT_ID},region=${_REGION},data_source_uri=${_DATA_SOURCE_URI}' # Pass pipeline parameters
    waitFor: ['Upload Pipeline']

options:
  # Specify a service account for Cloud Build with necessary permissions
  # (e.g., Storage Admin, Vertex AI User, Service Account User)
  logging: CLOUD_LOGGING_ONLY
  machineType: E2_HIGHCPU_8 # Or other suitable machine type
```

2. GitHub Actions Workflow (.github/workflows/main.yaml)

GitHub Actions allows you to automate workflows directly in your GitHub repository. This example uses Google Cloud's official GitHub Actions for authentication and interacting with Vertex AI.

This .github/workflows/main.yaml assumes your repository contains:

   - trainer/ directory with Dockerfile and main.py (your model training code).
   - pipeline/ directory with pipeline.py (your Kubeflow pipeline definition).

 ``` yaml
# filename: .github/workflows/main.yaml
# This GitHub Actions workflow defines a CI/CD pipeline for an MLOps project.

name: MLOps CI/CD Pipeline

on:
  push:
    branches:
      - main # Trigger on pushes to the main branch
    paths:
      - 'trainer/**' # Trigger if trainer code changes
      - 'pipeline/**' # Trigger if pipeline definition changes
      - '.github/workflows/main.yaml' # Trigger if workflow itself changes

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }} # Stored as GitHub Secret
  REGION: us-central1
  TRAINER_IMAGE_NAME: gcr.io/${{ secrets.GCP_PROJECT_ID }}/ml-trainer
  PIPELINE_NAME: my-mlops-pipeline
  DATA_SOURCE_URI: gs://your-bucket/raw_data/
  GCS_PIPELINE_BUCKET: ${{ secrets.GCP_PROJECT_ID }}-vertex-pipelines # Bucket for compiled pipelines and pipeline root

jobs:
  build_and_deploy_ml:
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write' # Required for Workload Identity Federation

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      # Step 1: Authenticate to Google Cloud
      # This uses Workload Identity Federation for secure authentication.
      # Ensure you have set up a Service Account and granted it necessary roles
      # (e.g., Storage Admin, Vertex AI User, Service Account User)
      # and configured Workload Identity Federation in GCP.
      - id: 'auth'
        uses: 'google-github-actions/auth@v2'
        with:
          workload_identity_provider: 'projects/${{ secrets.GCP_PROJECT_NUMBER }}/locations/global/workloadIdentityPools/github-pool/providers/github-provider' # Replace with your WIF provider
          service_account: 'github-actions-sa@${{ secrets.GCP_PROJECT_ID }}.iam.gserviceaccount.com' # Replace with your SA email

      # Step 2: Set up Google Cloud SDK
      - name: 'Set up Cloud SDK'
        uses: 'google-github-actions/setup-gcloud@v2'
        with:
          project_id: ${{ env.PROJECT_ID }}

      # Step 3: Build and Push Docker Image for the Trainer
      - name: 'Build and Push Trainer Image'
        run: |
          docker build -t ${{ env.TRAINER_IMAGE_NAME }}:latest ./trainer
          docker push ${{ env.TRAINER_IMAGE_NAME }}:latest

      # Step 4: Compile the Kubeflow Pipeline
      - name: 'Compile Pipeline'
        run: |
          pip install kfp google-cloud-aiplatform
          python pipeline/pipeline.py --output_file pipeline.json

      # Step 5: Upload the compiled pipeline to Cloud Storage
      - name: 'Upload Pipeline'
        run: |
          gsutil cp pipeline.json gs://${{ env.GCS_PIPELINE_BUCKET }}/compiled_pipelines/${{ env.PIPELINE_NAME }}.json

      # Step 6: Trigger the Vertex AI Pipeline Run
      - name: 'Trigger Vertex AI Pipeline'
        run: |
          gcloud ai pipelines runs create \
            --display-name="${{ env.PIPELINE_NAME }}-run-${{ github.run_id }}" \
            --pipeline-root="gs://${{ env.GCS_PIPELINE_BUCKET }}/pipeline_root" \
            --template-path="gs://${{ env.GCS_PIPELINE_BUCKET }}/compiled_pipelines/${{ env.PIPELINE_NAME }}.json" \
            --project="${{ env.PROJECT_ID }}" \
            --location="${{ env.REGION }}" \
            --parameter-values="project_id=${{ env.PROJECT_ID }},region=${{ env.REGION }},data_source_uri=${{ env.DATA_SOURCE_URI }}"
```

These templates provide a starting point for implementing robust MLOps practices with Vertex AI and Gemini. Remember to replace all placeholder values (e.g., your-gcp-project-id, your-bucket, your-email@example.com, YOUR_ENDPOINT_ID, YOUR_TRAINING_TABLE, YOUR_PROJECT_NUMBER) with your actual Google Cloud project and resource details.

## New Templates
 - custom_training_job.py: A Python script serving as an entry point for a custom Vertex AI Training job. This is fundamental for training custom TensorFlow models.
 - custom_prediction_routine.py: A Python script for a custom prediction routine used with Vertex AI Endpoints. Essential for handling specific input/output formats, pre/post-processing for your anomaly detection model, or integrating with your React frontend.
 - data_labeling_job.yaml: A YAML configuration for defining a Vertex AI Data Labeling job. Crucial for vision tasks, especially if you need to label normal/anomaly images.
 - vertex_pipeline_component.py: A Python script demonstrating how to create a reusable Kubeflow Pipelines (KFP) component, which is the building block for Vertex AI Pipelines.
 - gcp_resource_setup.sh: A shell script to automate the creation of common GCP resources (e.g., GCS buckets, Vertex AI project settings) needed for a new project setup. This helps with the "Getting Started" experience.
 - model_card_template.md: A Markdown template for documenting your trained models, promoting transparency and responsible AI.

## More Comming Soon 

