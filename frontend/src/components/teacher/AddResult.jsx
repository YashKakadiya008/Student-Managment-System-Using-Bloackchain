import React, { useState, useEffect } from 'react';
import { useResult } from '../../context/ResultContext'; // Access context for addStudentResult
import { useBlockchain } from '../../context/BlockchainContext'; // Access account details
import { useIpfs } from '../../context/IpfsContext';
import ResultUploadForm from '../HashUploadForm';

const TeacherAddResult = () => {
  const { addStudentResult, semesterCount } = useResult(); // Function to add student result
  const { teacherFactoryContract, account } = useBlockchain(); // Access teacher account
  const { resultHash, setResultHash } = useIpfs();
  const [studentAddress, setStudentAddress] = useState('');
  const [semesterId, setSemesterId] = useState(0);
  const [isTeacher, setIsTeacher] = useState(false); // Track if user is a teacher
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleAddResult = async () => {

    if (semesterId >= semesterCount) {
      setError('Invalid semester ID');
      return;
    }

    if (!studentAddress || !resultHash) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await addStudentResult(semesterId, studentAddress, resultHash);
      console.log("addStudenResult: ",semesterId, studentAddress, resultHash)
      setStudentAddress(''); // Clear input after success
      setResultHash('');
    } catch (err) {
      console.error('Error adding student result:', err);
      setError('Failed to add student result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Student Result (Teacher Only)</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
        <>
          <input
            type="number"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            placeholder="Enter Semester ID"
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            placeholder="Enter Student Address"
            className="block w-full p-2 border border-gray-300 rounded mb-4"
          />
          <ResultUploadForm />
          <button
            onClick={handleAddResult}
            disabled={loading}
            className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Adding...' : 'Add Result'}
          </button>
        </>
    </div>
  );
};

export default TeacherAddResult;
