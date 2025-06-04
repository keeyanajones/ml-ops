import React, { useState, useEffect } from 'react';

// Main App component for the MLOps Data Ingestion, Validation, Transformation, and Versioning Example
const App = () => {
    // Stage 1: Ingestion
    const [currentRawData, setCurrentRawData] = useState('');
    const [ingestionStatus, setIngestionStatus] = useState('');
    const [isDataIngested, setIsDataIngested] = useState(false);

    // Stage 2: Validation
    const [validatedData, setValidatedData] = useState('');
    const [validationStatus, setValidationStatus] = useState('');
    const [isDataValidated, setIsDataValidated] = useState(false);

    // Stage 3: Transformation
    const [transformedData, setTransformedData] = useState('');
    const [transformationStatus, setTransformationStatus] = useState('');
    const [isDataTransformed, setIsDataTransformed] = useState(false);

    // Stage 4: Versioning
    const [dataVersions, setDataVersions] = useState([]);
    const [versioningStatus, setVersioningStatus] = useState('');

    // Conceptual MLOps Service Readiness
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Simulate MLOps service initialization (e.g., Firebase Auth, cloud SDKs)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAuthReady(true);
            console.log("Simulated MLOps services (Auth) Ready.");
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // --- Stage 1: Data Ingestion ---
    const handleIngestData = () => {
        if (!currentRawData.trim()) {
            setIngestionStatus('Please enter some data to ingest.');
            return;
        }

        setIngestionStatus('Simulating data ingestion...');
        // In a real scenario, this would involve API calls to GCS/BigQuery/etc.
        setTimeout(() => {
            console.log(`Raw data ingested: "${currentRawData}"`);
            setIngestionStatus(`Successfully ingested raw data.`);
            setIsDataIngested(true);
            // The raw data is now available for the next step (validation)
            setValidatedData(currentRawData); // Pass raw data to next stage initially
        }, 1500);
    };

    // --- Stage 2: Data Validation ---
    /**
     * Simulates data validation.
     * In a real pipeline, this involves:
     * - Schema validation (e.g., using BigQuery schema, Apache Avro)
     * - Data quality checks (missing values, outliers, data type conformity)
     * - Business rules validation (e.g., amount must be positive)
     * Tools: Great Expectations, TensorFlow Data Validation (TFDV), custom scripts.
     */
    const handleValidateData = () => {
        if (!isDataIngested || !validatedData.trim()) {
            setValidationStatus('Please ingest data first.');
            return;
        }

        setValidationStatus('Performing data validation...');
        setTimeout(() => {
            let validationMessages = [];
            let isValid = true;

            // Example Validation Rule 1: Check for empty data
            if (validatedData.length === 0) {
                validationMessages.push("Validation Error: Data is empty.");
                isValid = false;
            }

            // Example Validation Rule 2: Simple check for "customer_id" in comma-separated data
            if (!validatedData.includes('customer_id') && validatedData.includes(',')) {
                validationMessages.push("Validation Warning: 'customer_id' column not found (expected for CSV).");
                // This might not make it invalid, but a warning
            }

            // Example Validation Rule 3: Check for specific format (e.g., starts with "HDR_")
            if (!validatedData.startsWith('HDR_') && !validatedData.includes(',')) {
                validationMessages.push("Validation Error: Data does not start with 'HDR_' (required for headerless data).");
                isValid = false;
            }

            if (isValid) {
                setValidationStatus('Data validation successful. Data is ready for transformation.');
                setIsDataValidated(true);
                // Pass the (conceptually) validated data to the next stage
                setTransformedData(validatedData);
            } else {
                setValidationStatus(`Data validation failed: ${validationMessages.join(' ')}`);
                setIsDataValidated(false); // Mark as not validated if any failure
            }
        }, 2000);
    };

    // --- Stage 3: Data Transformation ---
    /**
     * Simulates data transformation.
     * In a real pipeline, this involves:
     * - Feature engineering (creating new features from existing ones)
     * - Scaling, normalization, encoding categorical features
     * - Aggregation, joining disparate datasets
     * - Cleaning (handling missing values, outliers based on validation findings)
     * Tools: Dataflow, Dataproc (Spark/Hadoop), custom Python/Pandas scripts.
     */
    const handleTransformData = () => {
        if (!isDataValidated || !transformedData.trim()) {
            setTransformationStatus('Please validate data first.');
            return;
        }

        setTransformationStatus('Performing data transformation...');
        setTimeout(() => {
            let outputData = transformedData;

            // Example Transformation 1: Convert to uppercase (simple string manipulation)
            outputData = outputData.toUpperCase();

            // Example Transformation 2: Simulate adding a 'processed_timestamp' column
            if (outputData.includes(',')) {
                const lines = outputData.split('\n');
                const processedLines = lines.map((line, index) => {
                    // Assuming the first line is header, add to all data rows
                    if (index === 0 && line.includes('CUSTOMER_ID')) { // Check for a known header column
                        return `${line},PROCESSED_TIMESTAMP`;
                    }
                    if (line.trim() !== '') {
                        return `${line},${new Date().toISOString()}`;
                    }
                    return line;
                });
                outputData = processedLines.join('\n');
            } else {
                outputData = `PROCESSED_DATA: ${outputData} | TS:${new Date().toISOString()}`;
            }

            setTransformedData(outputData);
            setTransformationStatus('Data transformation successful. Data is ready for versioning.');
            setIsDataTransformed(true);
        }, 2500);
    };

    // --- Stage 4: Data Versioning ---
    const handleVersionData = () => {
        if (!isDataTransformed || !transformedData.trim()) {
            setVersioningStatus('Please transform data first before versioning.');
            return;
        }

        setVersioningStatus('Creating new data version...');
        setTimeout(() => {
            const versionId = `v${dataVersions.length + 1}-${Date.now()}`;
            const versionDetails = {
                id: versionId,
                timestamp: new Date().toLocaleString(),
                // In a real system, this would be a reference to the data's location in GCS/BigQuery
                dataReference: `Simulated snapshot of transformed data for ${versionId}`,
                description: `Data version created on ${new Date().toLocaleDateString()} after ingestion, validation, and transformation.`
            };

            setDataVersions(prevVersions => [...prevVersions, versionDetails]);
            setVersioningStatus(`Data version '${versionId}' created and registered.`);

            // Reset pipeline for new ingestion
            setCurrentRawData('');
            setIngestionStatus('');
            setIsDataIngested(false);
            setValidatedData('');
            setValidationStatus('');
            setIsDataValidated(false);
            setTransformedData('');
            setTransformationStatus('');
            setIsDataTransformed(false);
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
                `}
            </style>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    MLOps Data Pipeline: Ingestion, Validation, Transformation, Versioning (Conceptual)
                </h1>

                {!isAuthReady && (
                    <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-md animate-pulse">
                        Initializing MLOps services... (Simulated Firebase Auth)
                    </div>
                )}

                {isAuthReady && (
                    <>
                        {/* 1. Data Ingestion Section */}
                        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">1. Ingest Raw Data</h2>
                            <p className="text-gray-700 mb-4">
                                Enter raw data. This simulates receiving data from sources like databases, APIs, or streams.
                            </p>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-y min-h-[100px]"
                                placeholder="Example: customer_id,name,email,amount&#10;1,Alice,alice@example.com,100.50&#10;2,Bob,bob@example.com,75.00"
                                value={currentRawData}
                                onChange={(e) => setCurrentRawData(e.target.value)}
                                disabled={isDataIngested}
                            ></textarea>
                            <button
                                onClick={handleIngestData}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isDataIngested || !currentRawData.trim()}
                            >
                                Ingest Data
                            </button>
                            {ingestionStatus && (
                                <p className={`mt-4 text-sm font-medium ${ingestionStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                    {ingestionStatus}
                                </p>
                            )}
                        </div>

                        {/* 2. Data Validation Section */}
                        <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h2 className="text-2xl font-semibold text-yellow-700 mb-4">2. Validate Data</h2>
                            <p className="text-gray-700 mb-4">
                                Check data quality, schema compliance, and business rules after ingestion.
                                The data being validated is: <span className="font-mono bg-yellow-100 p-1 rounded text-sm text-yellow-800">{validatedData || 'N/A'}</span>
                            </p>
                            <button
                                onClick={handleValidateData}
                                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isDataIngested || isDataValidated}
                            >
                                Validate Data
                            </button>
                            {validationStatus && (
                                <p className={`mt-4 text-sm font-medium ${validationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                                    {validationStatus}
                                </p>
                            )}
                        </div>

                        {/* 3. Data Transformation Section */}
                        <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-4">3. Transform Data</h2>
                            <p className="text-gray-700 mb-4">
                                Clean, prepare, and engineer features from validated data.
                                Data for transformation: <span className="font-mono bg-purple-100 p-1 rounded text-sm text-purple-800">{transformedData || 'N/A'}</span>
                            </p>
                            <button
                                onClick={handleTransformData}
                                className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isDataValidated || isDataTransformed}
                            >
                                Transform Data
                            </button>
                            {transformationStatus && (
                                <p className={`mt-4 text-sm font-medium ${transformationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                                    {transformationStatus}
                                </p>
                            )}
                            {transformedData && isDataTransformed && (
                                <div className="mt-4 p-3 bg-purple-100 border border-purple-200 rounded-md text-purple-800 text-sm">
                                    <p className="font-semibold mb-1">Transformed Data Sample:</p>
                                    <pre className="whitespace-pre-wrap break-all text-xs">{transformedData.substring(0, 500)}...</pre>
                                </div>
                            )}
                        </div>

                        {/* 4. Data Versioning Section */}
                        <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4">4. Version Transformed Data</h2>
                            <p className="text-gray-700 mb-4">
                                Register the refined dataset's state and location for reproducibility. This would use Vertex ML Metadata.
                            </p>
                            <button
                                onClick={handleVersionData}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isDataTransformed}
                            >
                                Create New Data Version
                            </button>
                            {versioningStatus && (
                                <p className={`mt-4 text-sm font-medium ${versioningStatus.includes('created') ? 'text-green-600' : 'text-red-600'}`}>
                                    {versioningStatus}
                                </p>
                            )}
                        </div>

                        {/* Registered Data Versions List */}
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Registered Data Versions</h2>
                            {dataVersions.length === 0 ? (
                                <p className="text-gray-600">No data versions registered yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {dataVersions.map((version) => (
                                        <li key={version.id} className="p-4 bg-white rounded-md shadow-sm border border-gray-100">
                                            <p className="font-semibold text-gray-800">Version ID: <span className="font-normal text-gray-700">{version.id}</span></p>
                                            <p className="text-sm text-gray-600">Timestamp: {version.timestamp}</p>
                                            <p className="text-sm text-gray-600">Reference: {version.dataReference}</p>
                                            <p className="text-sm text-gray-600">Description: {version.description}</p>
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
