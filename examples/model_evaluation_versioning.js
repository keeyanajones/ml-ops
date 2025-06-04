import React, { useState, useEffect } from 'react';

// Main App component for the MLOps Data & Model Pipeline Example
const App = () => {
    // --- Data Pipeline Stages ---
    const [currentRawData, setCurrentRawData] = useState('');
    const [ingestionStatus, setIngestionStatus] = useState('');
    const [isDataIngested, setIsDataIngested] = useState(false);

    const [validatedData, setValidatedData] = useState(''); // Stores conceptually validated data
    const [validationStatus, setValidationStatus] = useState('');
    const [isDataValidated, setIsDataValidated] = useState(false);

    const [transformedData, setTransformedData] = useState(''); // Stores conceptually transformed data
    const [transformationStatus, setTransformationStatus] = useState('');
    const [isDataTransformed, setIsDataTransformed] = useState(false);

    const [versionedDataReference, setVersionedDataReference] = useState(''); // Stores ref to the versioned data
    const [dataVersions, setDataVersions] = useState([]);
    const [versioningStatus, setVersioningStatus] = useState('');
    const [isDataVersioned, setIsDataVersioned] = useState(false);

    // --- Model Pipeline Stages ---
    const [trainedModelId, setTrainedModelId] = useState('');
    const [trainingStatus, setTrainingStatus] = useState('');
    const [isModelTrained, setIsModelTrained] = useState(false);

    const [evaluationMetrics, setEvaluationMetrics] = useState(null);
    const [evaluationStatus, setEvaluationStatus] = useState('');
    const [isModelEvaluated, setIsModelEvaluated] = useState(false);

    const [modelVersions, setModelVersions] = useState([]);
    const [modelVersioningStatus, setModelVersioningStatus] = useState('');
    const [isModelVersioned, setIsModelVersioned] = useState(false); // Flag to reset pipeline for new model

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

    // --- Data Pipeline Functions (from previous example, slightly adjusted for flow) ---
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
            let isValid = validatedData.includes('customer_id'); // Simple check for demo
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
            setVersionedDataReference(ref); // Store this for training step
        }, 2000);
    };

    // --- New Model Pipeline Functions ---

    /**
     * Simulates the model training process.
     * In a real MLOps pipeline, this would involve:
     * 1. Triggering a training job (e.g., Vertex AI Custom Training, Managed Datasets).
     * 2. Using the *versioned* and *transformed* data as input.
     * 3. Logging training parameters, artifacts, and potentially interim metrics.
     * 4. Saving the trained model artifact (e.g., TensorFlow SavedModel, PyTorch model) to GCS.
     */
    const handleTrainModel = () => {
        if (!isDataVersioned || !versionedDataReference) {
            setTrainingStatus('Please version data first to train a model.');
            return;
        }

        setTrainingStatus(`Initiating model training using data: ${versionedDataReference}...`);
        setTimeout(() => {
            const modelId = `model-${Math.random().toFixed(4).substring(2)}`; // Unique model identifier
            setTrainedModelId(modelId);
            setTrainingStatus(`Model '${modelId}' trained successfully.`);
            setIsModelTrained(true);
        }, 3000); // Simulate longer training time
    };

    /**
     * Simulates the model evaluation process.
     * In a real MLOps pipeline, this would involve:
     * 1. Taking the trained model and a held-out evaluation dataset (also versioned).
     * 2. Calculating various performance metrics (accuracy, precision, recall, F1-score for classification; RMSE, MAE for regression).
     * 3. Storing evaluation results and potentially visualizations.
     * Tools: Vertex AI Model Evaluation, MLflow, custom evaluation scripts.
     */
    const handleEvaluateModel = () => {
        if (!isModelTrained || !trainedModelId) {
            setEvaluationStatus('Please train a model first.');
            return;
        }

        setEvaluationStatus(`Evaluating model '${trainedModelId}'...`);
        setTimeout(() => {
            const metrics = {
                accuracy: parseFloat((0.85 + Math.random() * 0.1).toFixed(3)), // Simulate 0.85 - 0.95
                precision: parseFloat((0.78 + Math.random() * 0.15).toFixed(3)),
                recall: parseFloat((0.80 + Math.random() * 0.1).toFixed(3)),
                f1_score: parseFloat((0.82 + Math.random() * 0.1).toFixed(3)),
                roc_auc: parseFloat((0.90 + Math.random() * 0.05).toFixed(3)) // High ROC AUC
            };
            setEvaluationMetrics(metrics);
            setEvaluationStatus(`Model '${trainedModelId}' evaluated. View metrics below.`);
            setIsModelEvaluated(true);
        }, 2500); // Simulate evaluation time
    };

    /**
     * Simulates the model versioning process.
     * In a real MLOps pipeline, this would involve:
     * 1. Registering the evaluated model in a model registry.
     * 2. Associating it with its performance metrics, training data version, and other metadata.
     * 3. Assigning a unique version number (e.g., '1.0', '1.1').
     * Tools: Vertex AI Model Registry, MLflow, DVC.
     */
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
                // Linkage to data version used for training
                trained_on_data_version: versionedDataReference,
                model_artifact_uri: `gs://my-model-repo/${trainedModelId}/model_artifact.tf` // Simulated artifact location
            };
            setModelVersions(prev => [...prev, modelVersionDetails]);
            setModelVersioningStatus(`Model '${trainedModelId}' registered as version v${newVersion}.`);
            setIsModelVersioned(true);

            // Reset all states for a new full pipeline run
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
            setVersioningStatus('');
            setIsDataVersioned(false);
            setTrainedModelId('');
            setTrainingStatus('');
            setIsModelTrained(false);
            setEvaluationMetrics(null);
            setEvaluationStatus('');
            setIsModelEvaluated(false);
            setIsModelVersioned(false); // Ready for next cycle
        }, 2000);
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
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .gap-4 { gap: 1rem; }
                `}
            </style>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Full MLOps Pipeline: Data to Model Versioning (Conceptual)
                </h1>

                {!isAuthReady && (
                    <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-md animate-pulse">
                        Initializing MLOps services... (Simulated Firebase Auth)
                    </div>
                )}

                {isAuthReady && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Data Pipeline */}
                            <div className="space-y-6">
                                {/* 1. Data Ingestion */}
                                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                                    <h2 className="text-xl font-semibold text-blue-700 mb-3">1. Ingest Raw Data</h2>
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
                                    <h2 className="text-xl font-semibold text-yellow-700 mb-3">2. Validate Data</h2>
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
                                    <h2 className="text-xl font-semibold text-purple-700 mb-3">3. Transform Data</h2>
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
                                            <p className="font-semibold mb-1">Transformed:</p>
                                            <pre className="whitespace-pre-wrap break-all">{transformedData}</pre>
                                        </div>
                                    )}
                                </div>

                                {/* 4. Data Versioning */}
                                <div className="p-6 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                                    <h2 className="text-xl font-semibold text-green-700 mb-3">4. Version Data</h2>
                                    <button
                                        onClick={handleVersionData}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isDataTransformed || isDataVersioned}
                                    >
                                        Create New Data Version
                                    </button>
                                    {versioningStatus && <p className={`mt-2 text-xs font-medium ${versioningStatus.includes('created') ? 'text-green-600' : 'text-red-600'}`}>{versioningStatus}</p>}
                                    {versionedDataReference && <p className="mt-2 text-xs text-gray-700">Ref: <span className="font-mono bg-green-100 p-1 rounded">{versionedDataReference}</span></p>}
                                </div>
                            </div>

                            {/* Right Column: Model Pipeline */}
                            <div className="space-y-6">
                                {/* 5. Model Training */}
                                <div className="p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                                    <h2 className="text-xl font-semibold text-red-700 mb-3">5. Train Model</h2>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Using data from: <span className="font-mono bg-red-100 p-1 rounded text-xs text-red-800">{versionedDataReference || 'No data versioned yet'}</span>
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
                                    <h2 className="text-xl font-semibold text-orange-700 mb-3">6. Evaluate Model</h2>
                                    <p className="text-gray-700 text-sm mb-3">
                                        Evaluating Model: <span className="font-mono bg-orange-100 p-1 rounded text-xs text-orange-800">{trainedModelId || 'No model trained yet'}</span>
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
                                    <h2 className="text-xl font-semibold text-teal-700 mb-3">7. Version Model</h2>
                                    <button
                                        onClick={handleVersionModel}
                                        className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        disabled={!isModelEvaluated || isModelVersioned}
                                    >
                                        Register Model Version
                                    </button>
                                    {modelVersioningStatus && <p className={`mt-2 text-xs font-medium ${modelVersioningStatus.includes('registered') ? 'text-green-600' : 'text-red-600'}`}>{modelVersioningStatus}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Registered Model Versions List */}
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
                                            <p className="text-sm text-gray-600">Trained on Data: <span className="font-mono">{version.trained_on_data_version}</span></p>
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
