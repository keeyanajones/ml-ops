# GCP Vertex AI Gemini Vision Examples: MLOps Playbook & Templates
This repository serves as a comprehensive resource for MLOps best practices, playbooks, and templates specifically designed for building, deploying, and managing Gemini Vision models on Google Cloud's Vertex AI.

**Built for developers and ML engineers utilizing:**
* **Vertex AI Workbench Jupyter Notebooks:** For interactive development, experimentation, and rapid prototyping.
* **Python:** The core language for ML logic, data processing, and pipeline orchestration.
* **TensorFlow:** For building, training, and fine-tuning robust computer vision models.
* **YAML:** For defining configurations, pipeline definitions, and resource specifications, ensuring clear, versionable infrastructure as code.
* **JavaScript (Node.js):** For automation scripts, particularly around data ingestion, deployment, and monitoring.
* **React:** (Potentially for future model serving UIs or interactive dashboards, as discussed)

The goal is to provide a structured approach to building, deploying, and maintaining high-quality, scalable, and reliable computer vision solutions using the power of Gemini and Vertex AI.

----

## Table of Contents

* [1. Introduction](#1-introduction)
* [2. What is Gemini Vision?](#2-what-is-gemini-vision)
* [3. MLOps Philosophy for Gemini Vision](#3-mlops-philosophy-for-gemini-vision)
    * [3.1. Key Principles](#31-key-principles)
    * [3.2. MLOps Lifecycle for Vision Models](#32-mlops-lifecycle-for-vision-models)
* [4. Repository Structure](#4-repository-structure)

* [5. Getting Started on Vertex AI Workbench](#5-getting-started-on-vertex-ai-workbench)
    * [5.1. Prerequisites](#51-prerequisites)
    * [5.2. Setting Up Your Workbench Instance](#52-setting-up-your-workbench-instance)
    * [5.3. Cloning the Repository](#53-cloning-the-repository)
    * [5.4. Installation & Environment Setup](#54-installation--environment-setup)
    * [5.5. Running Quick Start Examples](#55-running-quick-start-examples)

* [6. Playbooks & Guides](#6-playbooks--guides)
    * [6.1. Data Management for Vision Models](#61-data-management-for-vision-models)
    * [6.2. Model Development & Experimentation](#62-model-development--experimentation)
    * [6.3. CI/CD for Vision Models on Vertex AI](#63-cicd-for-vision-models-on-vertex-ai)
    * [6.4. Model Deployment & Serving Strategies](#64-model-deployment--serving-strategies)
    * [6.5. Monitoring Gemini Vision Models](#65-monitoring-gemini-vision-models)
    * [6.6. Model Retraining & Updates](#66-model-retraining--updates)

* [7. Examples & Templates](#7-examples--templates)
    * [7.1. MLOps Automation Scripts (JavaScript)](#71-mlops-automation-scripts-javascript)
    * [7.2. Vertex AI Playbooks (Jupyter Notebooks)](#72-vertex-ai-playbooks-jupyter-notebooks)
    * [7.3. General Help & Guides (Jupyter Notebooks)](#73-general-help--guides-jupyter-notebooks)
    * [7.4. Reusable Templates](#74-reusable-templates)

* [8. Contributing](#8-contributing)
* [9. Support & Community](#9-support--community)
* [10. License](#10-license)

----

## 1. Introduction

This repository provides a curated collection of examples, practical guides, and reusable templates to help you operationalize your Gemini Vision projects on Google Cloud's Vertex AI. Leveraging **Vertex AI Workbench Jupyter Notebooks** as your primary development environment, you'll find end-to-end solutions that demonstrate MLOps principles using **Python**, **TensorFlow**, **YAML**, and **JavaScript** for robust model lifecycle management.

## 2. What is Gemini Vision?

Briefly explain what Gemini Vision is, its capabilities (e.g., multimodal understanding, advanced image analysis), and its relevance for computer vision tasks. Highlight its strengths (e.g., flexibility, pre-trained capabilities).

----

## 3. MLOps Philosophy for Gemini Vision

Applying MLOps principles is crucial for building robust and maintainable ML systems. This section outlines our approach to MLOps within the context of Gemini Vision on Vertex AI, emphasizing the role of your chosen technologies.

### 3.1. Key Principles

* **Automation First:** Automate all repeatable processes to reduce manual errors and accelerate development cycles, often orchestrated via Vertex AI Pipelines defined in **YAML** and supported by **JavaScript** automation scripts.
* **Version Everything:** Maintain strict version control for code, datasets, trained models, and configurations (**YAML** files), as well as using Vertex AI's native versioning capabilities.
* **Reproducible Experiments:** Ensure that any experiment can be rerun to produce the same results, facilitating debugging and validation, particularly within **Vertex AI Workbench** sessions.
* **Continuous Everything (CI/CD/CT):** Implement continuous integration, continuous delivery/deployment, and continuous training (CT) pipelines using **Python**-based orchestrators and **YAML** definitions, often triggered by **JavaScript** scripts.
* **Proactive Monitoring:** Continuously monitor model performance, data quality, and infrastructure health to detect and address issues promptly, with setup scripts in **JavaScript** and **Python**.
* **Collaboration:** Foster seamless collaboration between data scientists (often working in **Workbench Notebooks**), ML engineers, and operations teams. The `help` directory provides specific guides for various team roles.

### 3.2. MLOps Lifecycle for Vision Models

We adhere to a standard MLOps lifecycle, with specific considerations for computer vision:

1.  **Data Ingestion & Preparation:**
    * Handling large image/video datasets efficiently on Cloud Storage.
    * Data labeling, annotation, and augmentation strategies (often scripted in **Python** or automated via **JavaScript** from `examples/data_ingestion_versioning.js`).
    * Data validation and quality checks specific to image data (see `examples/data_validation_transformation.js`).
    * Version control for datasets.
2.  **Model Development & Experimentation:**
    * Leveraging **Vertex AI Workbench** for interactive development of **TensorFlow** models (see `playbook/model-dev-experimentation.ipynb`).
    * Experiment tracking with Vertex AI Experiments for different Gemini Vision prompts, fine-tuning configurations, and model architectures.
    * Hyperparameter tuning with Vertex AI Vizier.
3.  **Model Training & Evaluation:**
    * Scalable training on Vertex AI Training, potentially with custom **TensorFlow** containers (see `playbook/training-automation.ipynb`).
    * Rigorous evaluation of vision model metrics (e.g., mAP, accuracy, F1-score) and visual inspection of predictions (see `playbook/evaluating-models.ipynb` and `examples/model_evaluation_versioning.js`).
    * Bias detection for vision models.
4.  **Model Registry & Versioning:**
    * Registering trained Gemini Vision models in Vertex AI Model Registry (see `playbook/model-registry.ipynb`).
    * Managing different model versions and their associated metadata (e.g., performance metrics, lineage).
5.  **CI/CD Pipeline (Vertex AI Pipelines):**
    * Automating the entire workflow from data ingestion to model deployment using Vertex AI Pipelines, with pipeline definitions often in **YAML** (`templates/pipeline.yaml`) or defined programmatically with **Python** (see `playbook/pipelines.ipynb`).
    * Automated testing of model quality before deployment.
6.  **Model Deployment & Serving:**
    * Deploying Gemini Vision models to Vertex AI Endpoints for online predictions or using Batch Prediction for offline inference (see `playbook/endpoints-batch-prediction.ipynb` and `examples/model_deployment.js`).
    * Strategies for optimizing serving latency and throughput for image/video data.
    * *(Optional: If you plan a frontend)* Considerations for integrating with **React** UIs for prediction requests.
7.  **Model Monitoring & Retraining:**
    * Monitoring prediction quality, input data drift (e.g., changes in image characteristics), and model drift (see `playbook/model-monitoring.ipynb` and `examples/monitoring_alerting.js`).
    * Setting up alerts for performance degradation using scripts like `templates/setup_model_monitoring.py`.
    * Triggering automated or manual retraining processes based on monitoring insights.

----

## 4. Repository Structure

This repository is organized into distinct directories to streamline MLOps practices:

```
├── ml-ops/
│   ├── examples
|   |    |── data_ingestion_versioning.js
|   |    |── data_validation_transformation.js
|   |    |── model_deployment.js
|   |    |── model_evaluation_versioning.js
|   |    |── monitoring_alerting.js
|   |    |── README.md 
|   ├── help
|   |    ├── ai-researcher.ipynb
|   |    ├── analysts-professional.ipynb
|   |    ├── analytics-professional.ipynb
|   |    ├── challenges.ipynb 
|   |    ├── data-python.ipynb
|   |    ├── data-scientist.ipynb
|   |    ├── data-tensorflow.ipynb
|   |    ├── educator.ipynb
|   |    ├── gemini-best-practices.ipynb
|   |    ├── ml-engineer.ipynb
|   |    ├── prompt-toolkit.ipynb
|   |    ├── security-governance.ipynb
|   |    ├── student.ipynb
|   |    ├── team-collab.ipynb
|   |    ├── vertex-troubleshooting.ipynb
|   |    |── README.md
│   ├── playbook
|   |    ├── adversarial-testing.ipynb
|   |    ├── anomaly-detection.ipynb
|   |    ├── architectural-exploration.ipynb
|   |    ├── custom-training-logic.ipynb
|   |    ├── data-augmentation.ipynb
|   |    ├── data-labeling.ipynb
|   |    ├── data-processing.ipynb
|   |    ├── data-versioning.ipynb
|   |    ├── dockerfile-creation.ipynb
|   |    ├── endpoint-deployment.ipynb
|   |    ├── endpoints-batch-prediction.ipynb
|   |    ├── evaluating-models.ipynb
|   |    ├── experiment-tracking.ipynb
|   |    ├── feature-store.ipynb 
|   |    ├── fine-tuning.ipynb
|   |    ├── gemini-vision-integration.ipynb
|   |    ├── hyperparameter-tuning.ipynb
|   |    ├── inference-testing.ipynb
|   |    ├── load-explore-datasets.ipynb
|   |    ├── local-docker-testing.ipynb
|   |    ├── model-dev-experimentation.ipynb
|   |    ├── model-monitoring.ipynb
|   |    ├── model-registration.ipynb
|   |    ├── model-registry.ipynb
|   |    ├── pipelines.ipynb
|   |    ├── quantitative-analysis.ipynb
|   |    ├── quantitative-evaluation.ipynb
|   |    ├── react-frontend-development.ipynb
|   |    ├── tensorboard.ipynb
|   |    ├── training-automation.ipynb
|   |    ├── workbench.ipynb
|   |    |── README.md
│   └── templates
|   |    ├── automated_jobs.py
|   |    ├── batch_prediction_using_bigquery.ipynb
|   |    ├── batch_prediction_vertex_ai_sdk.ipynb
|   |    ├── batch_prediction.py
|   |    ├── custom_prediction_routine.py
|   |    ├── custom_training_job.py
|   |    ├── data-labeling_job.yaml
|   |    ├── data-loading.py
|   |    ├── endpoints.py
|   |    ├── evaluation_metrics.py
|   |    ├── game_server.py
|   |    ├── gcp_resource_setup.sh
|   |    ├── model_card_template.md
|   |    ├── model_definition.py
|   |    ├── monitor_batch_prediction_gemini_api.ipynb
|   |    ├── pipeline.yaml
|   |    ├── pipelines.py 
|   |    ├── preprocessing.py
|   |    ├── setup_model_monitoring.py
|   |    ├── terraform.tfvars
|   |    ├── training_custom_model.py
|   |    ├── training.py
|   |    ├── tuning.py
|   |    ├── vertex_ai_dag.py
|   |    ├── vertex_ai.tf
|   |    ├── vertex_pipeline_component.py
|   |    |── README.md
|   |── README.md
```

## 5. Getting Started on Vertex AI Workbench

This section guides you through setting up your environment on **Vertex AI Workbench**, the recommended platform for interactive development and running the examples.

### 5.1. Prerequisites

* **Google Cloud Project:** An active GCP project with billing enabled.
* **GCP SDK:** Authenticated and configured on your local machine (if you're using `gcloud` commands).
* **Required APIs:** Ensure the following APIs are enabled in your GCP project:
    * **Vertex AI API**
    * **Cloud Storage API**
    * **Cloud Build API**
    * **Artifact Registry API** (if using custom Docker images for TensorFlow models)
    * **IAM API**
    * *(If using React for App Engine/Cloud Run)* **App Engine API** or **Cloud Run API**.
* **Node.js:** For running the JavaScript automation scripts found in `ml-ops/examples/`.

### 5.2. Setting Up Your Workbench Instance

1.  Go to the [Vertex AI Workbench](https://console.cloud.google.com/vertex-ai/workbench/instances) section in the GCP console.
2.  Click **"New Notebook"** and choose a managed notebooks instance.
3.  Select a suitable machine type (e.g., `n1-standard-4` or higher for GPU-accelerated workloads if you plan TensorFlow training).
4.  Crucially, ensure your service account has the necessary permissions (e.g., `Vertex AI User`, `Storage Object Admin`, `Service Account User`) to interact with Vertex AI services and Cloud Storage.
5.  Click **"Create"**. This may take a few minutes.

### 5.3. Cloning the Repository

Once your Workbench instance is running:

1.  Click **"Open JupyterLab"**.
2.  Open a new terminal within JupyterLab (File -> New -> Terminal).
3.  Clone this repository:
    ```bash
    git clone [https://github.com/your-org/gcp-vertex-ai-gemini-vision-mlops.git](https://github.com/your-org/gcp-vertex-ai-gemini-vision-mlops.git)
    cd gcp-vertex-ai-gemini-vision-mlops/ml-ops # Navigate into the main ml-ops directory
    ```

### 5.4. Installation & Environment Setup

It's highly recommended to create a new kernel/environment within your Workbench instance to manage dependencies.

1.  **Install Python dependencies:**
    ```bash
    # Ensure you are in the cloned repository's 'ml-ops' directory
    # Create a requirements.txt if you don't have one at the root of ml-ops
    # Example for common ML libraries if no requirements.txt exists yet:
    pip install google-cloud-aiplatform google-cloud-storage tensorflow ipykernel
    ```
2.  **Install Node.js dependencies (for JavaScript examples):**
    ```bash
    cd examples
    # If you have a package.json for Node.js dependencies:
    npm install # Or yarn install, if you use yarn
    cd .. # Go back to ml-ops directory
    ```
3.  **Create a custom Python kernel (optional but recommended for isolated environments):**
    ```bash
    python -m ipykernel install --user --name=gemini-vision-env --display-name "Python (Gemini Vision Env)"
    ```
    Then, within your notebooks, select this new kernel from the "Kernel" menu.

### 5.5. Running Quick Start Examples

To get a quick overview of how the components work:

* **For JavaScript automation:** Navigate to `examples/` and run a script (e.g., `node data_ingestion_versioning.js`). Refer to the `examples/README.md` for specific instructions.
* **For MLOps Playbook walkthroughs:** Open `playbook/workbench.ipynb` to understand how to leverage Vertex AI Workbench, or `playbook/pipelines.ipynb` for a deep dive into MLOps pipelines.
* **For general help & context:** Explore notebooks in the `help/` directory, such as `help/gemini-best-practices.ipynb`.

----

## 6. Playbooks & Guides

These guides provide in-depth information and best practices for various aspects of MLOps with Gemini Vision, leveraging your chosen technologies.

### 6.1. Data Management for Vision Models

* **[Data Ingestion & Versioning (JS)](examples/data_ingestion_versioning.js):** A JavaScript example script for automating data ingestion and versioning.
* **[Data Validation & Transformation (JS)](examples/data_validation_transformation.js):** A JavaScript example script demonstrating data validation and transformation steps.
* **[Data Processing Playbook (Python)](playbook/data-processing.ipynb):** A Jupyter Notebook detailing best practices for data processing for ML.
* **[Datasets Playbook (Python)](playbook/datasets.ipynb):** A Jupyter Notebook covering Vertex AI Datasets for managing image data.
* **[Feature Store Playbook (Python)](playbook/feature-store.ipynb):** A Jupyter Notebook on using Vertex AI Feature Store, though less common for raw image features, it's relevant for derived features.

### 6.2. Model Development & Experimentation

* **[Model Development & Experimentation Playbook (Python)](playbook/model-dev-experimentation.ipynb):** A comprehensive Jupyter Notebook on managing ML experiments with Vertex AI.
* **[Fine-tuning Playbook (Python)](playbook/fine-tuning.ipynb):** A Jupyter Notebook focusing on fine-tuning models, particularly relevant for Gemini Vision.
* **[TensorBoard Playbook (Python)](playbook/tensorboard.ipynb):** A Jupyter Notebook guide on using Vertex AI TensorBoard for experiment visualization.
* **[Gemini Best Practices (Python Notebook)](help/gemini-best-practices.ipynb):** Learn key strategies for leveraging Gemini Vision effectively.

### 6.3. CI/CD for Vision Models on Vertex AI

* **[Pipelines Playbook (Python)](playbook/pipelines.ipynb):** A Jupyter Notebook detailing how to build and orchestrate ML pipelines with Vertex AI Pipelines.
* **[Pipeline Template (YAML)](templates/pipeline.yaml):** A reusable YAML template for defining Vertex AI Pipelines.
* **[Training Automation Playbook (Python)](playbook/training-automation.ipynb):** A Jupyter Notebook on automating model training workflows.
* **[Model Deployment (JS)](examples/model_deployment.js):** A JavaScript example script for automating model deployment.

### 6.4. Model Deployment & Serving Strategies

* **[Endpoints & Batch Prediction Playbook (Python)](playbook/endpoints-batch-prediction.ipynb):** A Jupyter Notebook explaining online and batch prediction strategies on Vertex AI.
* **[Model Deployment (JS)](examples/model_deployment.js):** A JavaScript example script for automating model deployment.
* **[Model Registry Playbook (Python)](playbook/model-registry.ipynb):** A Jupyter Notebook on managing model versions and metadata in Vertex AI Model Registry.

### 6.5. Monitoring Gemini Vision Models

* **[Model Monitoring Playbook (Python)](playbook/model-monitoring.ipynb):** A Jupyter Notebook covering how to set up and interpret monitoring for your deployed Gemini Vision models.
* **[Monitoring & Alerting (JS)](examples/monitoring_alerting.js):** A JavaScript example script for setting up monitoring and alerting.
* **[Setup Model Monitoring (Python)](templates/setup_model_monitoring.py):** A Python script template for configuring Vertex AI Model Monitoring.

### 6.6. Model Retraining & Updates

* Retraining strategies are often integrated within the [Pipelines Playbook (Python)](playbook/pipelines.ipynb) and triggered by insights from the [Model Monitoring Playbook (Python)](playbook/model-monitoring.ipynb).

----

## 7. Examples & Templates

This section provides an overview of the ready-to-use content within this repository.

### 7.1. MLOps Automation Scripts (JavaScript)

Located in the `ml-ops/examples/` directory, these **JavaScript** scripts provide practical automation for key MLOps stages:

* **`data_ingestion_versioning.js`**: Automate the process of ingesting data and managing its versions.
* **`data_validation_transformation.js`**: Scripts for validating incoming data and applying necessary transformations.
* **`model_deployment.js`**: Automate the deployment of models to Vertex AI Endpoints.
* **`model_evaluation_versioning.js`**: Tools for automated model evaluation and versioning of evaluation results.
* **`monitoring_alerting.js`**: Set up automated monitoring and alerting for model performance and data drift.
* Refer to `ml-ops/examples/README.md` for detailed usage instructions for each script.

### 7.2. Vertex AI Playbooks (Jupyter Notebooks)

The `ml-ops/playbook/` directory contains comprehensive Jupyter Notebooks that serve as practical guides and walkthroughs for various MLOps concepts and Vertex AI features:

* **`adversarial-testing.ipynb`**: Adversarial testing applied across different domains.
* **`anomaly-detection.ipynb`**: Understanding Anomaly detection.
* **`architectural-exploration.ipynb`**: How Architectural Exploration is Conducted.
* **`custom-training-logic.ipynb`**: What is Custom Training Logic?.
* **`data-augmentation.ipynb`**: Common Data Augmentation Techniques (by Data Type).
* **`data-labeling.ipynb`**: Types of Data Labels.
* **`data-processing.ipynb`**: The Data Processing Cycle.
* **`data-versioning.ipynb`**: How Data Versioning is implemented.
* **`datasets.ipynb`**: Working with Vertex AI Datasets.
* **`dockerfile-creation.ipynb`**: Building and Running an image from a Dockerfile.
* **`endpoint-deployment.ipynb`**: Endpoint Deployment for Applications/Services.
* **`endpoints-batch-prediction.ipynb`**: Use Cases for Batch Prediction Endpoints.
* **`evaluating-models.ipynb`**: Evaluation Metrics by Task Type.
* **`experiment-tracking.ipynb`**: How to implement Experiment Tracking.
* **`feature-store.ipynb`**: Understanding and using Vertex AI Feature Store.
* **`fine-tuning.ipynb`**: Techniques for fine-tuning Gemini Vision models.
* **`gemini-vision-integration.ipynb`**: How to Integrate Gemini Vision into Applications.
* **`hyperparameter-tuning.ipynb`**: How is Hyperparameter Tuning is done.
* **`inference-testing.ipynb`**: Key Aspects and Goals of Inferences Testing.
* **`load-explore-datasets.ipynb`**: Loading and Exploring Datasets.
* **`local-docker-testing.ipynb`**: How to perform Local Docker Testing.
* **`model-dev-experimentation.ipynb`**: Managing ML experiments effectively.
* **`model-monitoring.ipynb`**: Setting up and interpreting model monitoring.
* **`model-registration.ipynb`**: Understanding Model Registration.
* **`model-registry.ipynb`**: How to use the Vertex AI Model Registry.
* **`pipelines.ipynb`**: Building and orchestrating automated ML pipelines.
* **`quantitative-analysis.ipynb`**: Key Quantitative Analysis Methods and Techniques.
* **`quantitative-evaluation.ipynb`**: Methods and Tools in Quantitative Evaluation.
* **`react-frontend-development.ipynb`**: React with Google Clouds Vertex, Gemini, and Vision.
* **`tensorboard.ipynb`**: Visualizing experiments with Vertex AI TensorBoard.
* **`training-automation.ipynb`**: Automating model training workflows.
* **`workbench.ipynb`**: Maximizing your productivity with Vertex AI Workbench.
* Refer to `ml-ops/playbook/README.md` for more context on these playbooks.

### 7.3. General Help & Guides (Jupyter Notebooks)

The `ml-ops/help/` directory provides Jupyter Notebooks with broader guidance and contextual information for various roles and challenges:

* **Persona-based Guides:** `ai-researcher.ipynb`, `analysts-professional.ipynb`,`analytics-professional.ipynb`, `data-scientist.ipynb`, `ml-engineer.ipynb`, `educator.ipynb`, `student.ipynb`.
* **Team Collaboration Guides:** `team-collab.ipynb`.
* **Technical Deep Dives:** `data-python.ipynb`, `data-tensorflow.ipynb`, `prompt-toolkit.ipynb`.
* **Specific Topics:** `challenges.ipynb`, `gemini-best-practices.ipynb`, `security-governance.ipynb`, `vertex-troubleshooting.ipynb`.
* Refer to `ml-ops/help/README.md` for more details on these helpful resources.

### 7.4. Reusable Templates

The `ml-ops/templates/` directory contains reusable code and configuration templates to accelerate your development:

* **`automated_jobs.py`**: .
* **`batch_prediction_using_bigquery_input_vertex_ai_sdk.ipynb`**: .
* **`batch_prediction_vertex_ai_sdk.ipynb`**: .
* **`batch_prediction.ipynb`**: .
* **`batch_prediction.py`**: .
* **`custom_prediction_routine.py`**: .
* **`custom_training_job.py`**: .
* **`data_labeling_job.yaml`**: .
* **`data_loading.py`**: .
* **`endpoints.py`**: .
* **`evaluation_metrics.py`**: .
* **`game_server.py`**: .
* **`gcp_resource_setup.sh`**: .
* **`model_card_template.md`**: .
* **`model_definition.py`**: .
* **`monitor_batch_prediction_gemini_api.ipynb`**: .
* **`pipeline.yaml`**: A foundational YAML template for defining Vertex AI Pipelines.
* **`pipeline.py`**: .
* **`preprocessing.py`**: .
* **`setup_model_monitoring.py`**: A Python script template to quickly configure Vertex AI Model Monitoring.
* **`terraform.tfvars`**: .
* **`training_custom_model.py`**: .
* **`training.py`**: .
* **`tuning.py`**: .
* **`vertex_ai_dag.py`**: .
* **`vertex_ai.tf`**: .
* **`vertex_pipeline_component.py`**: 

* Refer to `ml-ops/templates/README.md` for more information on how to use these templates.

----

## 8. Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) (create this file if it doesn't exist) for details on how to get started, report bugs, or suggest new features.

----

## 9. Support & Community

* If you have questions or encounter issues, please open an issue on this repository.
* Join the [Google Cloud Community Forums](https://www.googlecloudcommunity.com/) for broader discussions on Vertex AI and MLOps.

----

## 10. License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
