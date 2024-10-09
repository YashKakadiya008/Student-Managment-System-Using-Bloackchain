import React, { useState } from 'react';
import { useIpfs } from '../context/IpfsContext';

function ResultUploadForm() {
    const { resultHash, setResultHash } = useIpfs();
    const [file, setFile] = useState(null); // Holds the image or PDF file
    const [ipfsHash, setIpfsHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [previewURL, setPreviewURL] = useState('');

    const pinataApiKey = 'fa38ac0352740e425a7e';
    const pinataSecretApiKey = '309819514989cb9d4a656e30535dd2891e7e7138085441f67a1449b2db5dccb3';

    // Function to upload file to Pinata
    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append('file', file);
    
        const options = {
            method: 'POST',
            body: formData,
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            },
        };
    
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Failed to upload: ${response.statusText}`);
            }
            const result = await response.json();
            return result.IpfsHash; 
        } catch (error) {
            console.error('Error uploading to Pinata:', error);
            setErrorMessage(`Failed to upload file to IPFS: ${error.message}`);
            return null;
        }
    };

    // Handle file input (image or PDF selection)
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
            setFile(selectedFile);
            setPreviewURL(URL.createObjectURL(selectedFile)); // Generate preview URL
            setErrorMessage(''); // Clear any previous error
        } else {
            setErrorMessage('Please select a valid image or PDF file.');
            setFile(null);
            setPreviewURL(''); // Clear preview
        }
    };

    // Handle file upload (image or PDF)
    const handleFileUpload = async () => {
        if (file) {
            // Upload the selected file to IPFS
            const ipfsHash = await uploadToPinata(file);
            if (ipfsHash) {
                setIpfsHash(ipfsHash);
                setResultHash(ipfsHash); // Save to context
            }
        } else {
            setErrorMessage('Please select a file before uploading.');
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg  mb-4">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Upload Result to IPFS</h2>

            {/* Direct file input for image or PDF */}
            <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />

            {/* Preview Section */}
            {previewURL && (
                <div className="mb-4">
                    {file.type.startsWith('image/') ? (
                        <img
                            src={previewURL}
                            alt="Preview"
                            className="w-full h-auto rounded-lg"
                        />
                    ) : file.type === 'application/pdf' ? (
                        <embed
                            src={previewURL}
                            type="application/pdf"
                            className="w-full h-96 border rounded-lg"
                        />
                    ) : null}
                </div>
            )}

            {/* Upload Button */}
            <button
                type="button"
                onClick={handleFileUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-4"
            >
                Upload
            </button>

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            {/* Display Uploaded Hash */}
            {ipfsHash && (
                <div className="mt-4">
                    <p className="text-gray-700 font-semibold">Uploaded to IPFS: {ipfsHash}</p>
                    <a
                        href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 block"
                    >
                        View Uploaded File/Result
                    </a>
                </div>
            )}
        </div>
    );
}

export default ResultUploadForm;
