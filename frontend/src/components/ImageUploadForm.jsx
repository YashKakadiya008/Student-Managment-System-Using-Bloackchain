import React, { useState } from 'react';
import { useIpfs } from '../context/IpfsContext';

function ImageUploadForm() {
    const { photoHash, setPhotoHash } = useIpfs();
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const pinataApiKey = 'fa38ac0352740e425a7e';
    const pinataSecretApiKey = '309819514989cb9d4a656e30535dd2891e7e7138085441f67a1449b2db5dccb3';

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
            setErrorMessage(`Failed to upload image to IPFS: ${error.message}`);
            return null;
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'image/jpeg') {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile)); // For previewing the image before upload
        } else {
            setErrorMessage('Please select a valid .jpg file.');
            setFile(null);
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            const ipfsHash = await uploadToPinata(file);
            if (ipfsHash) {
                setIpfsHash(ipfsHash);
                setPhotoHash(ipfsHash);
            }
        } else {
            setErrorMessage('Please select a file before uploading.');
        }
    };

    const handleFrameClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div>
            {/* Hidden file input */}
            <input
                id="fileInput"
                type="file"
                accept="image/jpeg"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the file input
            />

            {/* Custom clickable frame */}
            <div
                onClick={handleFrameClick}
                style={{
                    width: '150px',
                    height: '200px',
                    border: '2px dashed #ccc', // Dashed border for the frame
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Selected"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    <span style={{ color: '#999' }}>Click to choose a file</span>
                )}
            </div>

            <button type="button" onClick={handleFileUpload}>
                Upload
            </button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {ipfsHash && (
                <div>
                    <p>Uploaded to IPFS: {ipfsHash}</p>
                    <img
                        src={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                        alt="Uploaded to IPFS"
                        style={{ maxWidth: '150px', maxHeight: '200px', objectFit: 'contain' }}
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUploadForm;
