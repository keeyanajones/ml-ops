import kfp
from kfp.dsl import component, pipeline
from google_cloud_pipeline_components import aiplatform as gcc_aip

# project and location details
PROJECT_ID = "my-project-id"
REGION = "my-region"
BUCKET_NAME = "gs://my-bucket-name"
PIPELINE_ROOT = f"{BUCKET_NAME}/pipeline-root"

# define a component for loading and preprocessing
@component(
    base_image ="python:3.9",
    package_to_install=["google-cloud-aiplatform", "pandas", "sklearn"], 
)

def load_and_preprocess_data(
    data_uri: str,
    train_split: float,
    val_split: float,
    test_split: float,
    output_train_data: Output[Dataset],
    output_val_data: Output[Dataset],
    output_test_data: Output[Dataset],
):
    import pandas as pd
    from sklearn.model_selection import train_test_split

    df = pd.read_csv(data.uri)
    x = df.drop("target_column", axis=1)
    y = df["target_column"]

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=(val_split + test_split), random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, test_size=test_split / (val_split + test_split), random_state=42)

train_df = pd.concat([X_train, y_train], axis=1)
val_df = pd.concat([X_val, y_val], axis=1)
test_df = pd.concat([X_test, y_test], axis=1)

train_df.to_csv(output_train_data.path, index=False)
val_df.to_csv(output_val_data.path, index=False)
test_df.to_csv(output_test_data.path, index=False)

# Define a component for training a classification model
@component(
    base_image ="tensorflow/tensorflow: 2.15.0-gpu",
    package_to_install=["scikit-learn"],
    gpu_limits=1, 
)

def train_model(
    train_data: Input[detaset],
    model_type: str,
    output_model: Output[Model],
):
    import pandas as pd
    from sklearn.linear_model import LogisticRegression
    from sklearn.svm import SVC
    import pickle
    import tensorflow as tf 

    train_df = pd.read_cvs(train_data.path)
    X_train = train_df.drop("target_column", axis=1)
    y_train = train_df["target_column"]

    if model_type == "logistic_regression":
        model = LogisticRegression()
    elif model_type == "svm": 
        model = SVC()
    else: 
        raise ValueError(f"Unsupported model type: {model_type}")

    model.fit(X_train, y_train)

    tf.saved_model.save(model, output_model.path)

# Define component for evaluating the trained model
@component(
    base_image ="python:3.9",
    package_to_install=["pandas", "sklearn"],
)

def evaluate_model(
    model: Input[Model],
    test_data: Input[Dataset],
    ouput_evaluation: Output[ClassificationMetrics],    
):
    import pandas as pd
    from sklearn.metrics import classification_report, accuracy_score
    import pickle
    import tensorflow as tf 

    test_df = pd.read_csv(test_data.path)
    X_test = test_df.drop("target_column", axis=1)
    y_test = test_df["target_column"]

    loaded_model = tf.saved_model.load(model.path)
    predict_fn = loaded_model.signatures["serving_default"]
    predictions = predict_fn(tf.constant(X_test.values, dtype=tf.float32))['dense_1'].numpy().argmax(axis=1)

    report = classification_report(y_test, predictions, output_dict=True)
    accuracy = accuracy_score(y_test, predictions)

    # Output evaluation metrics for Vertex AI model Registry
    output_evaluation.log_metric("acurracy", accuracy)
    for label, metrics in report.items():
        if label not in ["accuracy", "macro avg", "weighted avg"]:
            ouput_evaluation.log_metric(f"{label}_precision", metrics["precision"])
            ouput_evaluation.log_metric(f"{label}_recall", metrics["recall"])
            ouput_evaluation.log_metric(f"{label}_f1-score", metrics["f1-score"])

# Define the pipline
@pipeline(
    name="simple-classification-pipeline",
    description="A basic pipeline for training and evaluating a classification model.",   
)

def simple_classification_pipeline(
    data_uri: str,
    model_type: str = "logistic_regression",
    train_split: float = 0.8,
    val_split: float = 0.1,
    test_split: float = 0.1,
    project: str = "your-gcp-project-id",
    region: str = "us-central1",
    model_display_name: str = "simple-classifier-endpoint",
):
    # Data laoding and preprocessing step
    data_prep_task = load_and_preprocess_data(
        data_uri=data_uri,
        train_split=train_split,
        val_split=val_split,
        test_split=test_split,
    )

    # Model training step
    train_task = train_model(
        train_data=data_prep_task.outputs["output_train_data"],
        model_type=model_type,
    )

    # Model evaluation step
    eval_task = evaluate_model(
        model=train_task.outputs["output_model"],
        test_data=data_prep_task.outputs["output_test_data"],
    )

    # Conditional deployment (example - deploy only if accurracy is above a threshold)
    with dsl.Condition(eval_task.outputs["output_evaluation"], ["accuracy"] > 0.8):
        deploy_model_task = gcc_aip.ModeDeployOp(
            project=project,
            location=region,
            model=train_task.outputs["output_model"],
            display_name=model_display_name,
            endpoint=endpoint_display_name,
            traffic_split={"0": "100"},
            dedicated_resources={
                "min_replica_count": 1,
                "max_replica_count": 1,
                "machine_spec": {
                    "machine_type": "n1-standard-4",
                    "accelerator_type": "NVIDIA_TESLA_T4", 
                    "accelerator_count": 1,
                },
            },
        )

    if __name__ == "__main__":
        # Example usage:
        pipeline_func = simple_classification_pipeline
        arguments = {
            "data_uri": "gs://your-bucket/your-data.csv",            
        }

# You would typically compile and run this pipeline using the Vertex Ai SDK:
# from kfp.compiler import compiler
# compiler.Compiler().compile(
#   pipeline_func=pipeline_func,
#   package_path="simple_classification_pipeline.json",
# ) 
# 
# from google.cloud import aiplatform
# job = aiplatform.PipelineJob(
#   display_name="simple-classification-run",
#   template_path="simple_classification_pipeline.json",
#   pipeline_root=f"gs://your-bucket/pipeline_root",
#   parameter_values=arguments,
#   project="your-gcp-project-id",
#   location="us-central1",
# )
# 
# job.run()
# 
print("Pipeline definition created. See example useage for compilation and running.")       

