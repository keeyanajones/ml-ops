from google.cloud import aiplatform

#project location details
PROJECT_ID ="my project id"
REGION ="my region"
ENDPOINT_ID = "my endpoint" #ID of deployed models endpoint

def predict_custom_trained_model(project: str, 
                                 location: str, 
                                 endpoint: str, 
                                 instance: list):
    """Make prediction request to deployed model"""

aiplatform.int(project=project, location=location)    

endpoint = aiplatform.Endpoint(endpoint)

prediction = endpoint.predict(instances=instances)

print(prediction)
return prediction

#Example of prediction request

instance = [
    {"feature1": 1.0, "feature2": 2.5, "feature3": "example_string"},
    {"feature1": 0.5, "feature2": 3.0, "feature3": "another_string"},
]

predict_custom_trained_model(
    project=PROJECT_ID,
    location=REGION,
    endpoint=ENDPOINT_ID,
    instances=Instances,    
)

#Example to retreive endpoint information
def get_endpoint(project: str, 
                 location: str,
                 endpoint_id:str):
    """Retreive and endpoint"""

aiplatform.init(project=project, location=location)

endpoint = aiplatform.Endpoint(endpoint_id)

return endpoint

get_endpoint(project=PROJECT_ID, 
             location=REGION, 
             endpoint_id=ENDPOINT_ID)

