from google.cloud import aiplatform

def train_custom_model(
    project: str,
    location: str,
    display_name: str,
    container_uri: str,
    model_display_name: str,
    dataset_id: str,
    training_fraction_split: float = 0.8,
    validation_fraction_split: float = 0.1,
    test_fraction_split: float = 0.1,
    sync: bool = True,
):
    
    """
    Train a custom model using vertex ai

    Args:
        project: project ID.
        location: region.
        display_name: display name of training job.
        container_uri: uri of docker container image.
        model_display_name: display name of the resulting model.
        dataset_id: the id of the vertex ai dataset.
        training_fraction_split: fraction of data to use for training.
        validation_fraction_split: fraction of data to use for validation.
        test_fraction_split: fraction of data to use for testing
        sync: whether to execute synchoronously.
    """

    aiplatform.init(project=project, location=location)

    job = aiplatform.CustomContainerTrainingJob(
        display_name=display_name,
        container_uri=container_uri,
        model_serving_container_image_uri=container_uri,
    )

    model = job.run(
        dataset=dataset_id,
        model_display_name=model_display_name,
        training_fraction_split=training_fraction_split,
        validation_fraction_split=validation_fraction_split,
        test_fraction_split=test_fraction_split,
        sync=sync,
    )

    print(f"Model ID: {model.resource_name}") 
    return model

    # example usage 
    if __name__ == "__main__":
        project_id = "project_id"
        location = "location"
        job_display_name = "custom_training_job"
        container_image_uri = "docker_image_uri"
        model_name = "trained_model"
        datset_id = "dataset_id"

    trained_model = train_custom_model(
        project=project_id,
        location=location,
        display_name=job_display_name,
        container_uri=container_image_uri,
        model_display_name=model_name,
        dataset_id=datset_id,
    )
