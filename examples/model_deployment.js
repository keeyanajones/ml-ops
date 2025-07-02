import React, { useState, useEffect } from 'react';

// Main App component for the Full MLOps Pipeline Example
const App = () => {
    // --- Data Pipeline Stages ---
    const [currentRawData, setCurrentRawData] = useState('');
    const [ingestionStatus, setIngestionStatus] = useState('');
    const [isDataIngested, setIsDataIngested] = useState(false);

    const [validatedData, setValidatedData] = useState('');
    const [validationStatus, setValidationStatus] = useState('');
    const [isDataValidated, setIsDataValidated] = useState(false);

    const [transformedData, setTransformedData] = useState('');
    const [transformationStatus, setTransformationStatus] = useState('');
    const [isDataTransformed, setIsDataTransformed] = useState(false);

    const [versionedDataReference, setVersionedDataReference] = useState('');
    const [dataVersions, setDataVersions] = useState([]); // List of past data versions
    const [versioningStatus, setVersioningStatus] = useState('');
    const [isDataVersioned, setIsDataVersioned] = useState(false);

    // --- Model Pipeline Stages ---
    const [trainedModelId, setTrainedModelId] = useState('');
    const [trainingStatus, setTrainingStatus] = useState('');
    const [isModelTrained, setIsModelTrained] = useState(false);

    const [evaluationMetrics, setEvaluationMetrics] = useState(null);
    const [evaluationStatus, setEvaluationStatus] = useState('');
    const [isModelEvaluated, setIsModelEvaluated] = useState(false);

    const [currentModelVersion, setCurrentModelVersion] = useState(null); // Stores the details of the model about to be deployed
    const [modelVersions, setModelVersions] = useState([]); // List of past model versions
    const [modelVersioningStatus, setModelVersioningStatus] = useState('');
    const [isModelVersioned, setIsModelVersioned] = useState(false);

    // --- Deployment & Prediction Stages ---
    const [deployedModelEndpoint, setDeployedModelEndpoint] = useState('');
    const [deploymentStatus, setDeploymentStatus] = useState('');
    const [isModelDeployed, setIsModelDeployed] = useState(false);

    const [predictionInput, setPredictionInput] = useState('');
    const [predictionResult, setPredictionResult] = useState('');
    const [predictionStatus, setPredictionStatus] = useState('');

    // Conceptual MLOps Service Readiness
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Simulate MLOps service initialization
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAuthReady(true);
            console.log("Simulated MLOps services (Auth) Ready.");
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // --- Data Pipeline Functions (from previous example) ---
    const handleIngestData = () => {
        if (!currentRawData.trim()) { setIngestionStatus('Please enter some data to ingest.'); return; }
        setIngestionStatus('Simulating data ingestion...');
        setTimeout(() => {
            setIngestionStatus(`Successfully ingested raw data.`);
            setIsDataIngested(true);
            setValidatedData(currentRawData);
        }, 1000);
    };

    const handleValidateData = () => {
        if (!isDataIngested || !validatedData.trim()) { setValidationStatus('Please ingest data first.'); return; }
        setValidationStatus('Performing data validation...');
        setTimeout(() => {
            let isValid = validatedData.includes('customer_id');
            setValidationStatus(isValid ? 'Data validation successful.' : 'Data validation failed (missing "customer_id").');
            setIsDataValidated(isValid);
            if (isValid) setTransformedData(validatedData);
        }, 1500);
    };

    const handleTransformData = () => {
        if (!isDataValidated || !transformedData.trim()) { setTransformationStatus('Please validate data first.'); return; }
        setTransformationStatus('Performing data transformation...');
        setTimeout(() => {
            const transformed = transformedData.toUpperCase() + `|PROCESSED_TS:${new Date().toISOString()}`;
            setTransformedData(transformed);
            setTransformationStatus('Data transformation successful.');
            setIsDataTransformed(true);
        }, 1800);
    };

    const handleVersionData = () => {
        if (!isDataTransformed || !transformedData.trim()) { setVersioningStatus('Please transform data first before versioning.'); return; }
        setVersioningStatus('Creating new data version...');
        setTimeout(() => {
            const versionId = `data-v${dataVersions.length + 1}-${Date.now()}`;
            const ref = `gs://my-datasets/processed_data_${versionId}.csv`;
            const versionDetails = { id: versionId, timestamp: new Date().toLocaleString(), dataReference: ref, description: 'Transformed data snapshot.' };
            setDataVersions(prev => [...prev, versionDetails]);
            setVersioningStatus(`Data version '${versionId}' created.`);
            setIsDataVersioned(true);
            setVersionedDataReference(ref);
        }, 2000);
    };

    // --- Model Pipeline Functions (from previous example) ---
    const handleTrainModel = () => {
        if (!isDataVersioned || !versionedDataReference) {
            setTrainingStatus('Please version data first to train a model.');
            return;
        }
        setTrainingStatus(`Initiating model training using data: ${versionedDataReference}...`);
        setTimeout(() => {
            const modelId = `model-${Math.random().toFixed(4).substring(2)}`;
            setTrainedModelId(modelId);
            setTrainingStatus(`Model '${modelId}' trained successfully.`);
            setIsModelTrained(true);
        }, 3000);
    };

    const handleEvaluateModel = () => {
        if (!isModelTrained || !trainedModelId) {
            setEvaluationStatus('Please train a model first.');
            return;
        }
        setEvaluationStatus(`Evaluating model '${trainedModelId}'...`);
        setTimeout(() => {
            const metrics = {
                accuracy: parseFloat((0.85 + Math.random() * 0.1).toFixed(3)),
                precision: parseFloat((0.78 + Math.random() * 0.15).toFixed(3)),
                recall: parseFloat((0.80 + Math.random() * 0.1).toFixed(3)),
                f1_score: parseFloat((0.82 + Math.random() * 0.1).toFixed(3)),
                roc_auc: parseFloat((0.90 + Math.random() * 0.05).toFixed(3))
            };
            setEvaluationMetrics(metrics);
            setEvaluationStatus(`Model '${trainedModelId}' evaluated. View metrics below.`);
            setIsModelEvaluated(true);
        }, 2500);
    };

    const handleVersionModel = () => {
        if (!isModelEvaluated || !evaluationMetrics) {
            setModelVersioningStatus('Please evaluate the model first.');
            return;
        }
        setModelVersioningStatus(`Registering model '${trainedModelId}' as a new version...`);
        setTimeout(() => {
            const newVersion = modelVersions.length + 1;
            const modelVersionDetails = {
                version: `v${newVersion}`,
                modelId: trainedModelId,
                timestamp: new Date().toLocaleString(),
                metrics: evaluationMetrics,
                trained_on_data_version: versionedDataReference,
                model_artifact_uri: `gs://my-model-repo/${trainedModelId}/model_artifact.tf`
            };
            setModelVersions(prev => [...prev, modelVersionDetails]);
            setCurrentModelVersion(modelVersionDetails); // Set the current model to be deployed
            setModelVersioningStatus(`Model '${trainedModelId}' registered as version v${newVersion}.`);
            setIsModelVersioned(true);
        }, 2000);
    };

    // --- New Deployment & Prediction Functions ---
    /**
     * Simulates model deployment.
     * In a real MLOps pipeline, this involves:
     * 1. Taking a versioned model from the registry.
     * 2. Deploying it to a managed endpoint (e.g., Vertex AI Endpoints).
     * 3. Allocating compute resources (GPUs, CPUs).
     * 4. Configuring traffic splitting (e.g., for A/B testing or canary deployments).
     * 5. The endpoint serves predictions via an API.
     */
    const handleDeployModel = () => {
        if (!isModelVersioned || !currentModelVersion) {
            setDeploymentStatus('Please version a model first before deployment.');
            return;
        }

        setDeploymentStatus(`Deploying model version '${currentModelVersion.version}' to an endpoint...`);
        setTimeout(() => {
            const endpointId = `predict-${currentModelVersion.modelId.replace('model-', '')}-${Date.now().toString().slice(-4)}`;
            const endpointUri = `https://us-central1-aiplatform.googleapis.com/v1/projects/my-project/locations/us-central1/endpoints/${endpointId}:predict`;
            setDeployedModelEndpoint(endpointUri);
            setDeploymentStatus(`Model '${currentModelVersion.modelId}' deployed successfully to endpoint: ${endpointUri}`);
            setIsModelDeployed(true);
        }, 3000); // Simulate deployment time
    };

    /**
     * Simulates making a prediction against the deployed model.
     * In a real MLOps pipeline, this involves:
     * 1. Sending an input payload (e.g., JSON) to the deployed model's endpoint.
     * 2. The model processes the input and returns a prediction.
     * 3. This often involves real-time inference or batch predictions.
     */
    const handlePredict = () => {
        if (!isModelDeployed || !deployedModelEndpoint) {
            setPredictionStatus('Please deploy a model first to make predictions.');
            return;
        }
        if (!predictionInput.trim()) {
            setPredictionStatus('Please enter some input data for prediction.');
            return;
        }

        setPredictionStatus(`Requesting prediction from endpoint: ${deployedModelEndpoint}...`);
        setTimeout(() => {
            // Simulate a simple prediction based on input keywords
            let simulatedScore;
            if (predictionInput.toLowerCase().includes('good') || predictionInput.toLowerCase().includes('positive') || predictionInput.toLowerCase().includes('happy')) {
                simulatedScore = (0.7 + Math.random() * 0.3).toFixed(2); // High score
            } else if (predictionInput.toLowerCase().includes('bad') || predictionInput.toLowerCase().includes('negative') || predictionInput.toLowerCase().includes('unhappy')) {
                simulatedScore = (0.1 + Math.random() * 0.2).toFixed(2); // Low score
            } else {
                simulatedScore = (0.4 + Math.random() * 0.2).toFixed(2); // Neutral score
            }
            const result = `Prediction: { "score": ${simulatedScore}, "class": "${simulatedScore > 0.5 ? 'Positive' : 'Negative'}" }`;
            setPredictionResult(result);
            setPredictionStatus('Prediction received successfully.');
        }, 1500);
    };

    // Function to reset the entire pipeline for a new run
    const resetPipeline = () => {
        setCurrentRawData('');
        setIngestionStatus('');
        setIsDataIngested(false);
        setValidatedData('');
        setValidationStatus('');
        setIsDataValidated(false);
        setTransformedData('');
        setTransformationStatus('');
        setIsDataTransformed(false);
        setVersionedDataReference('');
        setDataVersions([]); // Clear all data versions
        setVersioningStatus('');
        setIsDataVersioned(false);
        setTrainedModelId('');
        setTrainingStatus('');
        setIsModelTrained(false);
        setEvaluationMetrics(null);
        setEvaluationStatus('');
        setIsModelEvaluated(false);
        setCurrentModelVersion(null);
        setModelVersions([]); // Clear all model versions
        setModelVersioningStatus('');
        setIsModelVersioned(false);
        setDeployedModelEndpoint('');
        setDeploymentStatus('');
        setIsModelDeployed(false);
        setPredictionInput('');
        setPredictionResult('');
        setPredictionStatus('');
        console.log("Pipeline reset. Ready for a new run.");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

            <style>
                {`
                body { font-family: 'Inter', sans-serif; }
                textarea::-webkit-scrollbar { width: 8px; }
                textarea::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                textarea::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
                textarea::-webkit-scrollbar-thumb:hover { background: #555; }
                .grid-cols-2-uneven { grid-template-columns: 2fr 3fr; } /* Data/Model vs Deployment/Prediction */
                .gap-6 { gap: 1.5rem; }
                `}
            </style>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Full MLOps Pipeline: Data to Deployment & Prediction (Conceptual)
                </h1>

                {!isAuthReady && (
                    <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-md animate-pulse">
                        Initializing MLOps services... (Simulated Auth)
                    </div>
                )}

                {isAuthReady && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2-uneven gap-6">
                            {/* Left Column: Data & Model Pipeline */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-700 mb-4 col-span-full">Data & Model Development</h2>
                                {/* 1. Data Ingestion */}
                                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-blue-700 mb-3">1. Ingest Raw Data</h3>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3 resize-y min-h-[80px] text-sm"
                                        placeholder="Example: customer_id,name,email,amount&#10;1,Alice,alice@example.com,100.50&#10;2,Bob,bob@example.com,75.00"
                                        value={currentRawData}
                                        onChange={(e) => setCurrentRawData(e.target.value)}
                                        disabled={isDataIngested}
                                    ></textarea>
                                    <button
                                        onClick={handleIngestData}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={isDataIngested || !currentRawData.trim()}
                                    >
                                        Ingest Data
                                    </button>
                                    {ingestionStatus && <p className={`mt-2 text-xs font-medium ${ingestionStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>{ingestionStatus}</p>}
                                </div>

                                {/* 2. Data Validation */}
                                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-yellow-700 mb-3">2. Validate Data</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Validating: <span className="font-mono bg-yellow-100 p-1 rounded text-xs text-yellow-800">{validatedData ? validatedData.substring(0, 30) + '...' : 'N/A'}</span>
                                    </p>
                                    <button
                                        onClick={handleValidateData}
                                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isDataIngested || isDataValidated}
                                    >
                                        Validate Data
                                    </button>
                                    {validationStatus && <p className={`mt-2 text-xs font-medium ${validationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{validationStatus}</p>}
                                </div>

                                {/* 3. Data Transformation */}
                                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-purple-700 mb-3">3. Transform Data</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Transforming: <span className="font-mono bg-purple-100 p-1 rounded text-xs text-purple-800">{transformedData ? transformedData.substring(0, 30) + '...' : 'N/A'}</span>
                                    </p>
                                    <button
                                        onClick={handleTransformData}
                                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isDataValidated || isDataTransformed}
                                    >
                                        Transform Data
                                    </button>
                                    {transformationStatus && <p className={`mt-2 text-xs font-medium ${transformationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{transformationStatus}</p>}
                                    {transformedData && isDataTransformed && (
                                        <div className="mt-3 p-2 bg-purple-100 border border-purple-200 rounded-md text-purple-800 text-xs overflow-auto max-h-20">
                                            <p className="font-semibold mb-1">Transformed Data:</p>
                                            <pre className="whitespace-pre-wrap break-all">{transformedData}</pre>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Data Versioning */}
                                <div className="p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-green-700 mb-3">4. Version Data</h3>
                                    <button
                                        onClick={handleVersionData}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isDataTransformed || isDataVersioned}
                                    >
                                        Create New Data Version
                                    </button>
                                    {versioningStatus && <p className={`mt-2 text-xs font-medium ${versioningStatus.includes('created') ? 'text-green-600' : 'text-red-600'}`}>{versioningStatus}</p>}
                                    {versionedDataReference && <p className="mt-2 text-xs text-gray-700">Ref: <span className="font-mono bg-green-100 p-1 rounded">{versionedDataReference.substring(0, 40)}...</span></p>}
                                </div>

                                {/* 5. Model Training */}
                                <div className="p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-red-700 mb-3">5. Train Model</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Using data from: <span className="font-mono bg-red-100 p-1 rounded text-xs text-red-800">{versionedDataReference ? versionedDataReference.substring(0, 30) + '...' : 'N/A'}</span>
                                    </p>
                                    <button
                                        onClick={handleTrainModel}
                                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isDataVersioned || isModelTrained}
                                    >
                                        Train Model
                                    </button>
                                    {trainingStatus && <p className={`mt-2 text-xs font-medium ${trainingStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{trainingStatus}</p>}
                                    {trainedModelId && <p className="mt-2 text-xs text-gray-700">Trained Model ID: <span className="font-mono bg-red-100 p-1 rounded">{trainedModelId}</span></p>}
                                </div>

                                {/* 6. Model Evaluation */}
                                <div className="p-6 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-orange-700 mb-3">6. Evaluate Model</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Evaluating Model: <span className="font-mono bg-orange-100 p-1 rounded text-xs text-orange-800">{trainedModelId || 'N/A'}</span>
                                    </p>
                                    <button
                                        onClick={handleEvaluateModel}
                                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isModelTrained || isModelEvaluated}
                                    >
                                        Evaluate Model
                                    </button>
                                    {evaluationStatus && <p className={`mt-2 text-xs font-medium ${evaluationStatus.includes('evaluated') ? 'text-green-600' : 'text-red-600'}`}>{evaluationStatus}</p>}
                                    {evaluationMetrics && (
                                        <div className="mt-3 p-2 bg-orange-100 border border-orange-200 rounded-md text-orange-800 text-xs">
                                            <p className="font-semibold mb-1">Metrics:</p>
                                            <ul className="list-disc list-inside">
                                                {Object.entries(evaluationMetrics).map(([key, value]) => (
                                                    <li key={key}><strong>{key}:</strong> {value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* 7. Model Versioning */}
                                <div className="p-6 bg-teal-50 rounded-lg border border-teal-200 shadow-sm">
                                    <h3 className="text-xl font-semibold text-teal-700 mb-3">7. Version Model</h3>
                                    <button
                                        onClick={handleVersionModel}
                                        className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isModelEvaluated || isModelVersioned}
                                    >
                                        Register Model Version
                                    </button>
                                    {modelVersioningStatus && <p className={`mt-2 text-xs font-medium ${modelVersioningStatus.includes('registered') ? 'text-green-600' : 'text-red-600'}`}>{modelVersioningStatus}</p>}
                                    {currentModelVersion && <p className="mt-2 text-xs text-gray-700">Model Version to Deploy: <span className="font-mono bg-teal-100 p-1 rounded">{currentModelVersion.version}</span></p>}
                                </div>
                            </div>

                            {/* Right Column: Deployment & Prediction */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-700 mb-4 col-span-full">Model Deployment & Inference</h2>
                                {/* 8. Model Deployment */}
                                <div className="p-6 bg-blue-grey-50 rounded-lg border border-blue-grey-200 shadow-sm"> {/* Using a new color scheme for deployment */}
                                    <h3 className="text-xl font-semibold text-blue-grey-700 mb-3">8. Deploy Model</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Deploying model version: <span className="font-mono bg-blue-grey-100 p-1 rounded text-xs text-blue-grey-800">{currentModelVersion ? currentModelVersion.version : 'N/A'}</span>
                                    </p>
                                    <button
                                        onClick={handleDeployModel}
                                        className="w-full bg-blue-grey-600 text-white py-2 px-4 rounded-md hover:bg-blue-grey-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isModelVersioned || isModelDeployed}
                                    >
                                        Deploy Model to Endpoint
                                    </button>
                                    {deploymentStatus && <p className={`mt-2 text-xs font-medium ${deploymentStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{deploymentStatus}</p>}
                                    {deployedModelEndpoint && (
                                        <div className="mt-3 p-2 bg-blue-grey-100 border border-blue-grey-200 rounded-md text-blue-grey-800 text-xs overflow-auto max-h-20">
                                            <p className="font-semibold mb-1">Deployed Endpoint:</p>
                                            <pre className="whitespace-pre-wrap break-all">{deployedModelEndpoint}</pre>
                                        </div>
                                    )}
                                </div>

                                {/* 9. Make Predictions */}
                                <div className="p-6 bg-lime-50 rounded-lg border border-lime-200 shadow-sm"> {/* Another new color */}
                                    <h3 className="text-xl font-semibold text-lime-700 mb-3">9. Make Predictions</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Input for prediction:
                                    </p>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-500 mb-3 resize-y min-h-[80px] text-sm"
                                        placeholder="Enter data for prediction (e.g., 'This is a good product')"
                                        value={predictionInput}
                                        onChange={(e) => setPredictionInput(e.target.value)}
                                        disabled={!isModelDeployed}
                                    ></textarea>
                                    <button
                                        onClick={handlePredict}
                                        className="w-full bg-lime-600 text-white py-2 px-4 rounded-md hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isModelDeployed || !predictionInput.trim()}
                                    >
                                        Get Prediction
                                    </button>
                                    {predictionStatus && <p className={`mt-2 text-xs font-medium ${predictionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{predictionStatus}</p>}
                                    {predictionResult && (
                                        <div className="mt-3 p-2 bg-lime-100 border border-lime-200 rounded-md text-lime-800 text-xs overflow-auto max-h-20">
                                            <p className="font-semibold mb-1">Prediction Result:</p>
                                            <pre className="whitespace-pre-wrap break-all">{predictionResult}</pre>
                                        </div>
                                    )}
                                </div>

                                {/* Reset Button */}
                                <div className="p-6 bg-gray-200 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Reset Pipeline</h3>
                                    <button
                                        onClick={resetPipeline}
                                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold text-sm"
                                    >
                                        Reset All Stages
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Registered Model Versions List (Global) */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Registered Model Versions</h2>
                            {modelVersions.length === 0 ? (
                                <p className="text-gray-600">No model versions registered yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {modelVersions.map((version) => (
                                        <li key={version.version} className="p-4 bg-white rounded-md shadow-sm border border-gray-100">
                                            <p className="font-semibold text-gray-800">Model Version: <span className="font-normal text-gray-700">{version.version}</span></p>
                                            <p className="text-sm text-gray-600">Model ID: {version.modelId}</p>
                                            <p className="text-sm text-gray-600">Timestamp: {version.timestamp}</p>
                                            <p className="text-sm text-gray-600">Trained on Data: <span className="font-mono">{version.trained_on_data_version.substring(0, 40)}...</span></p>
                                            <p className="text-sm text-gray-600">Artifact URI: <span className="font-mono">{version.model_artifact_uri}</span></p>
                                            <div className="mt-2 text-xs">
                                                <p className="font-semibold text-gray-700">Metrics:</p>
                                                <ul className="list-disc list-inside ml-2">
                                                    {Object.entries(version.metrics).map(([key, value]) => (
                                                        <li key={key}><strong>{key}:</strong> {value}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
