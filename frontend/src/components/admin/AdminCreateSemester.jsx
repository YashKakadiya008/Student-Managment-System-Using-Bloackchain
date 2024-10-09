import React, { useState } from 'react';
import AdminSemesterResults from './AdminSemesterResult'; 
import { useResult } from '../../context/ResultContext'; 
import { useBlockchain } from '../../context/BlockchainContext'; 

const AdminCreateSemester = () => {
  const { createSemester } = useResult(); 
  const { account } = useBlockchain(); 
  const [semesterName, setSemesterName] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 

  const handleCreateSemester = async () => {
    setLoading(true);
    setError('');
    try {
      await createSemester(semesterName);
      setSemesterName(''); 
    } catch (err) {
      console.error('Error creating semester:', err);
      setError('Failed to create semester');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel</h2>

      {/* Form to create a new semester */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Create a New Semester</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Semester Name</label>
          <input
            type="text"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            placeholder="Enter semester name"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button 
          onClick={handleCreateSemester} 
          disabled={loading}
          className={`w-full p-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Creating...' : 'Create Semester'}
        </button>
      </div>

      {/* Display all semesters */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Semesters:</h3>
        <AdminSemesterResults />
      </div>
    </div>
  );
};

export default AdminCreateSemester;
