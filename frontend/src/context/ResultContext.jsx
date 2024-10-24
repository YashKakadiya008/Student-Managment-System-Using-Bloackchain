import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBlockchain } from './BlockchainContext';

const ResultContext = createContext();

export const useResult = () => useContext(ResultContext);

export const ResultProvider = ({ children }) => {
  const {
    account,
    resultContract
  } = useBlockchain();

  const [semesterCount, setSemesterCount] = useState(0);

  useEffect(() => {
    const fetchSemesterCount = async () => {
      if (resultContract) {
        const count = await resultContract.methods.semesterCount().call();
        setSemesterCount(count);
      }
    };

    fetchSemesterCount();
  }, [resultContract]);

  const createSemester = async (semesterName) => {
    if (!resultContract) return;
    try {
      await resultContract.methods
        .createSemesterResult(semesterName)
        .send({ from: account });
      console.log("createSemester:", semesterName)
      const updatedCount = await resultContract.methods.semesterCount().call();
      setSemesterCount(updatedCount);
    } catch (error) {
      console.error('Error creating semester:', error);
    }
  };

  const addStudentResult = async (semesterId, studentAddress, resultHash) => {
    if (!resultContract) return;
    try {
      await resultContract.methods
        .addStudentResult(semesterId, studentAddress, resultHash)
        .send({ from: account, gas: 5000000 });
    } catch (error) {
      console.error('Error adding student result:', error);
    }
  };

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
