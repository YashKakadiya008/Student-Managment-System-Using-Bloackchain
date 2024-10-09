import React, { useState, useEffect } from 'react';
import { useStudentTeacher } from '../../context/StudentTeacherContext';
import { useBlockchain } from '../../context/BlockchainContext';
import { useIpfs } from '../../context/IpfsContext';
import HashUploadForm from '../HashUploadForm';

const AddEvent = () => {
  const { addCertificate, getCertificates } = useStudentTeacher();
  const { resultHash, setResultHash } = useIpfs();
  const { account } = useBlockchain();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventRemark, setEventRemark] = useState('');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const fetchedCertificates = await getCertificates(account);
      setCertificates(fetchedCertificates);
    };

    fetchCertificates();
  }, [account, getCertificates]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    // Check for required fields
    if (!eventName || !eventDate || !resultHash) {
      alert('Please fill in all fields.');
      return;
    }

    // Convert eventDate (actual date) to Unix timestamp
    const unixTimestamp = Math.floor(new Date(eventDate).getTime() / 1000);

    // Add the certificate
    await addCertificate(account, eventName, BigInt(unixTimestamp), resultHash, eventRemark);

    // Clear the form fields
    setEventName('');
    setEventDate('');
    setResultHash('');
    setEventRemark('');

    // Refresh the certificates after adding a new one
    const updatedCertificates = await getCertificates(account);
    setCertificates(updatedCertificates);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add Event Certificate</h2>
      <form onSubmit={handleAddEvent} className="mb-6">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="date"
          placeholder="Event Date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Event Remark"
          value={eventRemark}
          onChange={(e) => setEventRemark(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />
        <HashUploadForm />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Event Certificates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
           <div key={index} className="border rounded p-4 shadow">
  <h3 className="text-xl font-semibold">{cert.eventName}</h3>
  <p className="mt-2">Date: {new Date(cert.eventDate.toString() * 1000).toLocaleDateString()}</p>

  {/* Ensure the file hash breaks into new lines as needed */}
  <p className="mt-2 break-words">File Hash: {cert.fileHash}</p>

  {/* Display certificate image using IPFS link */}
  <img
    src={`https://ipfs.io/ipfs/${cert.fileHash}`}
    alt="Certificate"
    className="mt-2 max-w-full h-auto"
  />
  <p className="mt-2">Remark: {cert.eventRemark}</p>
</div>

          ))
        ) : (
          <p className="text-gray-500">No events found.</p>
        )}
      </div>
    </div>
  );
};

export default AddEvent;
