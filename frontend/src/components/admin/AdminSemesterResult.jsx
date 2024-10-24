import React, { useEffect, useState } from 'react';
import { useResult } from '../../context/ResultContext';
import { useBlockchain } from '../../context/BlockchainContext';

const AdminSemesterResults = () => {
  const { semesterCount, getStudentResult } = useResult();
  const { resultContract } = useBlockchain();
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      setError('');
      const allSemesters = [];

      try {

        for (let i = 0; i < semesterCount; i++) {
          const semesterName = await resultContract.methods.semesterResults(i).call();
          allSemesters.push({ id: i, name: semesterName.semesterName });
        }
        setSemesters(allSemesters);
      } catch (err) {
        console.error('Error fetching semesters:', err);
        setError('Failed to fetch semesters.');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, [semesterCount, resultContract]);

  const handleSemesterClick = async (semesterId) => {
    setSelectedSemesterId(semesterId);
    setLoading(true);
    setError('');

    try {
      const allResults = [];

      const studentAddresses = await resultContract.methods.getAllStudentsForSemester(semesterId).call();

      for (const address of studentAddresses) {
        const result = await getStudentResult(semesterId, address);
        if (result) {
          allResults.push({ address, result });
        }
      }
      setStudentResults(allResults);
    } catch (err) {
      console.error('Error fetching student results:', err);
      setError('Failed to fetch student results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">All Created Semesters</h2>
      {loading ? (
        <p>Loading semesters...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {semesters.map((semester) => (
            <li
              key={semester.id}
              className="cursor-pointer mb-2 p-2 border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => handleSemesterClick(semester.id)}
            >
              semester - {semester.id + 1}
            </li>
          ))}
        </ul>
      )}

      {selectedSemesterId !== null && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Results for Semester: {selectedSemesterId + 1}</h3>
          {loading ? (
            <p>Loading results...</p>
          ) : studentResults.length === 0 ? (
            <p>No results found for this semester.</p>
          ) : (
            <ul>
              {studentResults.map((result, index) => (
                <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
                  <div>
                    <strong>Student Address:</strong> {result.address}
                  </div>
                  <div>
                    <strong>Result:</strong> {result.result}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSemesterResults;
