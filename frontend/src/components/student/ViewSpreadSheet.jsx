import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import Student from '../../contracts/Student.json';
import { useStudentTeacher } from '../../context/StudentTeacherContext';
import { useNavigate } from 'react-router-dom';
import web3 from '../../web3';

const ViewSpreadSheet = () => { 
  const { getSpreadSheets } = useStudentTeacher();
  
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();
  const { studentFactoryContract, account } = useBlockchain();
  const [studentContract, setStudentContract] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});

  // Load student contract on component mount
  useEffect(() => {
    loadStudent();
  }, []);

  // Load student details when studentContract is set
  useEffect(() => {
    if (studentContract) {
      loadStudentDetails();
    }
  }, [studentContract]);

  const loadStudent = async () => {
    try {
      setLoading(true);  // Set loading to true while fetching
      const studentContractAddress = await studentFactoryContract.methods.getStudent(account).call();
      const student_Contract = new web3.eth.Contract(Student.abi, studentContractAddress);
      setStudentContract(student_Contract);
    } catch (error) {
      console.error("Error loading student contract:", error);
      setError("Failed to load student contract");
    } finally {
      setLoading(false);  // Set loading to false after fetching
    }
  };

  const loadStudentDetails = async () => {
    try {
      const teacher = await studentContract.methods.teacher().call();

      if (!teacher || teacher === "0x0000000000000000000000000000000000000000") {
        setError('Teacher not assigned for this student.');
        return;
      }

      setStudentDetails({ teacher });
    } catch (error) {
      console.error("Error loading student details:", error);
      setError("Failed to load student details");
    }
  };

  // Fetch spreadsheets when teacher is available
  useEffect(() => {
    const fetchSpreadsheets = async () => {
      try {
        setLoading(true); // Loading while fetching spreadsheets
        if (!studentDetails.teacher) {
          console.error('Teacher not found in student details');
          return; // Exit early if teacher is not set
        }

        const fetchedSpreadsheets = await getSpreadSheets(studentDetails.teacher);

        // Check and log fetched data
        if (Array.isArray(fetchedSpreadsheets)) {
          console.log("Fetched Spreadsheets:", fetchedSpreadsheets);
          setSpreadsheets(fetchedSpreadsheets);
        } else {
          console.error('Unexpected response format', fetchedSpreadsheets);
        }
      } catch (err) {
        console.error('Error fetching spreadsheets:', err);
        setError('Failed to load spreadsheets. Please try again later.');
      } finally {
        setLoading(false); // Loading is false after fetching
      }
    };

    if (studentDetails.teacher) {
      fetchSpreadsheets();
    }
  }, [studentDetails.teacher, getSpreadSheets]);

  // Handle the navigation to view the spreadsheet
  const handleSheetClick = (sheetlink) => {
    const encodedLink = encodeURIComponent(sheetlink); // Encode the link
    navigate(`goolespreadsheet/${encodedLink}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Spreadsheets</h2>
      
      {loading ? (
        <p>Loading...</p>  // Show loading while fetching
      ) : error ? (
        <p className="text-red-500">{error}</p>  // Show error if any
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spreadsheets.length > 0 ? (
            spreadsheets.map((sheet, index) => (
              <div key={index} className="border rounded p-4 shadow">
                <h3 className="text-xl font-semibold">{sheet.title}</h3>
                <button
                  onClick={() => handleSheetClick(sheet.sheetlink)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No spreadsheets found for this teacher.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSpreadSheet;
