import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBlockchain } from './BlockchainContext'; // Import BlockchainContext

// Create the context
const ResultContext = createContext(); // This is used internally but not exported

// Export the useContext hook for easy access
export const useResult = () => useContext(ResultContext);

// Export the provider for wrapping components
export const ResultProvider = ({ children }) => {
  const {
    account,
    studentFactoryContract,
    teacherFactoryContract,
    adminContract,
    resultContract // Result contract from BlockchainContext
  } = useBlockchain();

  const [semesterCount, setSemesterCount] = useState(0);

  // Initialize the ResultContract and fetch initial semester count
  useEffect(() => {
    const fetchSemesterCount = async () => {
      if (resultContract) {
        const count = await resultContract.methods.semesterCount().call();
        setSemesterCount(count);
      }
    };

    fetchSemesterCount();
  }, [resultContract]);

  // Function to create a new semester
  const createSemester = async (semesterName) => {
    if (!resultContract) return;
    try {
      await resultContract.methods
        .createSemesterResult(semesterName)
        .send({ from: account });
      console.log("createSemester:",semesterName )
      // Update semester count after the semester is created
      const updatedCount = await resultContract.methods.semesterCount().call();
      setSemesterCount(updatedCount);
    } catch (error) {
      console.error('Error creating semester:', error);
    }
  };

  // Function to add a student's result
  const addStudentResult = async (semesterId, studentAddress, resultHash) => {
    if (!resultContract) return;
    try {
      await resultContract.methods
        .addStudentResult(semesterId, studentAddress, resultHash)
        .send({ from: account , gas: 5000000 });
    } catch (error) {
      console.error('Error adding student result:', error);
    }
  };

  // Function to fetch a student's result
  const getStudentResult = async (semesterId, studentAddress) => {
    if (!resultContract) return;
    try {
      const result = await resultContract.methods
        .getStudentResult(semesterId, studentAddress)
        .call();
      return result;
    } catch (error) {
      console.error('Error fetching student result:', error);
    }
  };

  // Function to verify a student's result
  const verifyStudentResult = async (semesterId, studentAddress, hashToCheck) => {
    if (!resultContract) return;
    try {
      const isValid = await resultContract.methods
        .verifyResult(semesterId, studentAddress, hashToCheck)
        .call();
      return isValid;
    } catch (error) {
      console.error('Error verifying student result:', error);
    }
  };

  return (
    <ResultContext.Provider
      value={{
        semesterCount,
        createSemester,
        addStudentResult,
        getStudentResult,
        verifyStudentResult,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
