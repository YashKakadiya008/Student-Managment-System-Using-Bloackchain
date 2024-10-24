import React, { useEffect, useState } from 'react';
import { useResult } from '../../context/ResultContext'; 
import { useBlockchain } from '../../context/BlockchainContext';

const Result = () => {
  const { semesterCount, getStudentResult } = useResult();
  const { account } = useBlockchain();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllResults = async () => {
      setLoading(true);
      setError('');
      const allResults = [];

      try {
        for (let semesterId = 0; semesterId < semesterCount; semesterId++) {
          const result = await getStudentResult(semesterId, account);
          if (result) {
            allResults.push({ semesterId, resultHash: result });
          }
        }
        setResults(allResults);
      } catch (err) {
        console.error('Error fetching all student results:', err);
        setError('Failed to fetch results.');
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchAllResults();
    }
  }, [account, semesterCount, getStudentResult]);

  const download = async (hash) => {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `result_${hash}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  if (loading) {
    return <p>Loading results...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">All Semester Results</h2>
      {results.length === 0 ? (
        <p>No results found for this student.</p>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li key={index} className="mb-2 p-2 border border-gray-300 rounded">
              <div>
                <strong>Semester:</strong> {(result.semesterId) + 1}
              </div>
              <div>
                <strong>Result:</strong>
                {false ? <img
                  src={`https://gateway.pinata.cloud/ipfs/${result.resultHash}`}
                  alt={`Result for semester ${result.semesterId}`}
                  className="my-2 w-full h-auto"
                /> : <p>PDF file download</p>}
                <button
                  onClick={() => download(result.resultHash)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Result;
