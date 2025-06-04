from google.cloud import aiplatform

# project and location settings
PROJECT_ID = "project_id"
LOCATION = "location"
MODEL_ID = "text-bison@001"
DATASET_URI ="gs://bucket/fine_tuning_data.jsonl"
TRAINED_MODEL_DISPLAY_NAME = "fine_tuned_model"

aiplatform.init(project=PROJECT_ID, location=LOCATION)

# Machine Type and Accelerator Configuration for fine tuning
machine_type = "a2-highgpu-1g"
accelerator_type = "NVIDIA_TESLA_A100"
accelerator_count = 1

# Hyperparameters
training_parameters = {
    "learning_rate_multiplier": 0.1,
    "epochs": 3,
    "batch_size": 4,

}

# Fine-tuning job creation
job = aiplatform.FineTuningJob(
    display_name=TRAINED_MODEL_DISPLAY_NAME,
    model=MODEL_ID,
    training_data=DATASET_URI,
    model_parameters=training_parameters,
    training_fraction_split=0.8,
    machine_spec=aiplatform.MachineSpec(
        machine_type=machine_type,
        accelerator_type=accelerator_type,
        accelerator_count=accelerator_count,
    ),
)

# Run the fine tuning job
model = job.run()

print(f"Fine-tuned model: {model.resource_name}")

