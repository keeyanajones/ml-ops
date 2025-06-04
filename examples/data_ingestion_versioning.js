import React, { useState, useEffect } from 'react';

// Main App component for the MLOps Data Ingestion and Versioning Example
const App = () => {
    // State to hold the data currently being "ingested"
    const [currentData, setCurrentData] = useState('');
    // State to store a list of simulated data versions
    const [dataVersions, setDataVersions] = useState([]);
    // State for displaying messages related to data ingestion
    const [ingestionStatus, setIngestionStatus] = useState('');
    // State for displaying messages related to data versioning
    const [versioningStatus, setVersioningStatus] = useState('');
    // State to track if Firebase is initialized and auth is ready (conceptual for real apps)
    const [isAuthReady, setIsAuthReady] = useState(false);

    // useEffect to simulate Firebase initialization and auth state changes
    // In a real application, this would involve actual Firebase SDK calls.
    useEffect(() => {
        // Simulate a delay for authentication to be ready
        const timer = setTimeout(() => {
            setIsAuthReady(true);
            console.log("Simulated Firebase Auth Ready.");
        }, 1000); // Simulate 1 second delay

        return () => clearTimeout(timer); // Cleanup timer
    }, []);

    /**
     * Simulates the data ingestion process.
     * In a real MLOps pipeline, this would involve:
     * 1. Receiving data from various sources (e.g., databases, streaming platforms, APIs).
     * 2. Performing initial validation and cleaning.
     * 3. Storing raw or pre-processed data in a data lake (e.g., Google Cloud Storage).
     * 4. Potentially loading into a data warehouse (e.g., BigQuery) or feature store (Vertex AI Feature Store).
     */
    const handleIngestData = () => {
        if (!currentData.trim()) {
            setIngestionStatus('Please enter some data to ingest.');
            return;
        }

        setIngestionStatus('Simulating data ingestion...');
        // Simulate an API call or backend process
        setTimeout(() => {
            // In a real scenario, this data would be stored in GCS, BigQuery, etc.
            console.log(`Data ingested: "${currentData}"`);
            setIngestionStatus(`Successfully ingested data. Ready for versioning.`);
            // Clear the input after "ingestion"
            setCurrentData('');
        }, 1500); // Simulate network delay
    };

    /**
     * Simulates the data versioning process.
     * In a real MLOps pipeline, this would involve:
     * 1. Taking the currently "ingested" or prepared data.
     * 2. Creating a unique identifier for this version (e.g., timestamp, hash).
     * 3. Storing metadata about this version (e.g., location in GCS, schema, source, creation date).
     * 4. Registering this version in a metadata store (e.g., Vertex ML Metadata, DVC, MLflow).
     * 5. Potentially creating a snapshot or immutable reference to the data.
     * 6. This version can then be used to train models, ensuring reproducibility.
     */
    const handleVersionData = () => {
        if (!ingestionStatus.includes('Successfully ingested data')) {
            setVersioningStatus('Please ingest data first before versioning.');
            return;
        }

        setVersioningStatus('Creating new data version...');
        // Simulate an API call or backend process
        setTimeout(() => {
            const versionId = `v${dataVersions.length + 1}-${Date.now()}`;
            const versionDetails = {
                id: versionId,
                timestamp: new Date().toLocaleString(),
                // In a real system, this would be a reference to the data's location
                // e.g., 'gs://my-bucket/datasets/my_data_v1.0.csv'
                // or a Vertex AI Feature Store entity type version.
                dataReference: `Simulated data snapshot for ${versionId}`,
                description: `Data version created on ${new Date().toLocaleDateString()}`
            };

            setDataVersions(prevVersions => [...prevVersions, versionDetails]);
            setVersioningStatus(`Data version '${versionId}' created and registered.`);
            setIngestionStatus(''); // Reset ingestion status after versioning
        }, 2000); // Simulate network delay
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                /* Custom scrollbar for textareas */
                textarea::-webkit-scrollbar {
                    width: 8px;
                }
                textarea::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                textarea::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                textarea::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                `}
            </style>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    MLOps Data Ingestion & Versioning (Conceptual)
                </h1>

                {!isAuthReady && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md animate-pulse">
                        Initializing MLOps services... (Simulated Firebase Auth)
                    </div>
                )}

                {isAuthReady && (
                    <>
                        {/* Data Ingestion Section */}
                        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">1. Simulate Data Ingestion</h2>
                            <p className="text-gray-700 mb-4">
                                Enter some raw data below. In a real scenario, this would be data
                                coming from various sources (databases, APIs, logs, etc.) that
                                gets loaded into your data lake/warehouse (e.g., GCS, BigQuery).
                            </p>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-y min-h-[100px]"
                                placeholder="Enter your raw data here (e.g., 'customer_id,name,email,purchase_date,amount')"
                                value={currentData}
                                onChange={(e) => setCurrentData(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleIngestData}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md"
                            >
                                Ingest Data
                            </button>
                            {ingestionStatus && (
                                <p className={`mt-4 text-sm font-medium ${ingestionStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                    {ingestionStatus}
                                </p>
                            )}
                        </div>

                        {/* Data Versioning Section */}
                        <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                            <h2 className="text-2xl font-semibold text-purple-700 mb-4">2. Version Data</h2>
                            <p className="text-gray-700 mb-4">
                                Once data is ingested and potentially pre-processed, you create a
                                version. This registers the dataset's state and location, making
                                your ML experiments reproducible. This metadata would typically
                                be stored in Vertex ML Metadata or a custom versioning system.
                            </p>
                            <button
                                onClick={handleVersionData}
                                className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out font-semibold shadow-md"
                            >
                                Create New Data Version
                            </button>
                            {versioningStatus && (
                                <p className={`mt-4 text-sm font-medium ${versioningStatus.includes('created') ? 'text-green-600' : 'text-red-600'}`}>
                                    {versioningStatus}
                                </p>
                            )}
                        </div>

                        {/* Data Versions List */}
                        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4">3. Registered Data Versions</h2>
                            {dataVersions.length === 0 ? (
                                <p className="text-gray-600">No data versions registered yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {dataVersions.map((version) => (
                                        <li key={version.id} className="p-4 bg-white rounded-md shadow-sm border border-green-100">
                                            <p className="font-semibold text-green-800">Version ID: <span className="font-normal text-gray-700">{version.id}</span></p>
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
