import kfp
from kfp import dsl
from kfp.v2 import compiler
from kfp.v2.dsl import component
from google.cloud import aiplatform

# project and location details
PROJECT_ID = "my-project-id"
REGION = "my-region"
BUCKET_NAME = "gs://my-bucket-name"
PIPELINE_ROOT = f"{BUCKET_NAME}/pipeline-root"

# define a component
@component(
    base_image ="python:3.9",
    package_to_install=["google-cloud-aiplatform"],
    output_component_file="my_component.yaml", # optional    
)

def my_component(input_text: str, 
                 output_text:dsl.Output[str]):
    """a component that processes text"""
    processed_text = f"Processed: {input_text}"
with open(output_text.path, "w") as f:
    f.write(processed_text)

# Define the pipeline
@dsl.pipeline(
    page_title="my pipeline",
    pipleline_root=PIPELINE_ROOT,
    description="a pipeline example",
)

def my_pipeline(input_string: str = "hello vertex ai pipelines!")
"""Pipelines definition"""
task_1 = my_component(input_text=input_string)
# add more ...
# task_2 = my_component(input_data=task_1.output)

# compile pipeline
compiler.Compiler().compile(
    pipeline_func=my_pipeline, package_path="my_pipeline.json"    
)

# run the pipleline on vertex ai 
job = aiplatform.PipelineJob(
    display_name="my-pipeline-job",
    template_path="my-pipeline.json",
    pipeline_root=PIPELINE_ROOT,
    parameter_values={"input_string": "Intitial Input"}, # optional
    enable_caching=True, # optional
    project=PROJECT_ID,
    location=REGION,
)

job.run()

print(f"Pipeline job: {job.resource_name}")
