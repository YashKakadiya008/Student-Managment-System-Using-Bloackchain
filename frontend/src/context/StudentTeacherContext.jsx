import React, { createContext, useContext,useState, useEffect } from 'react';
import web3 from '../web3';
import Student from '../contracts/Student.json';
import Teacher from '../contracts/Teacher.json' // Import contracts
import { useBlockchain } from './BlockchainContext';

const StudentTeacherContext = createContext();

export const useStudentTeacher = () => useContext(StudentTeacherContext);

export const StudentTeacherProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const {
        account,
        studentFactoryContract,
        teacherFactoryContract
} = useBlockchain();

  const loadAllStudents = async () => {
    try {
      const studentAddresses = await studentFactoryContract.methods.getAllStudents().call();
      const studentDetails = await Promise.all(
        studentAddresses.map(async (address) => {
          const studentContractAddress = await studentFactoryContract.methods.getStudent(address).call();
          const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);

          const photo = await studentContract.methods.ipfsHash_photo().call();
          const id = await studentContract.methods.id().call();
          const name = await studentContract.methods.name().call();
          const age = await studentContract.methods.age().call();
          const gmail = await studentContract.methods.gmail().call();
          const mobileNo = await studentContract.methods.mobile_no().call();
          const course = await studentContract.methods.course().call();
          const remarks = await studentContract.methods.remarks().call();
          const account = await studentContract.methods.account().call();
          const teacherAddress = await studentContract.methods.teacher().call();
        
          let isTeacherAssig ;
          let teacher_name;
          console.log("teacher : ",teacherAddress);
          if(teacherAddress === "0x0000000000000000000000000000000000000000")
          {
            teacher_name = "NA"
            isTeacherAssig=false;
          }
          else{
            const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAddress).call();
            const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
            teacher_name = await teacherContract.methods.name().call();
            isTeacherAssig=true;
          }

          return { photo,id, name, age, gmail, mobileNo, course, remarks, account ,teacher_name,isTeacherAssig };
        })
      );

      setStudents(studentDetails);
    } catch (err) {
      setError('Error loading student data.');
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  };

  const loadAllTeachers = async () => {
    try {
      const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
      const teacherDetails = await Promise.all(
        teacherAddresses.map(async (address) => {
          console.log("teacher address :" ,address);
          const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(address).call();
          const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
          const photo = await teacherContract.methods.ipfsHash_photo().call();
          const id = await teacherContract.methods.id().call();
          const name = await teacherContract.methods.name().call();
          const subject = await teacherContract.methods.subject().call();
          const gmail = await teacherContract.methods.gmail().call();
          const account = await teacherContract.methods.account().call();

          return {photo,id, name,subject,gmail, account };
        })
      );
      setTeachers(teacherDetails); // Set all existing teachers in state
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError('Error loading teacher data.');
    }
  };

  const assignTeacher = async (studentAccount, teacherAddress) => {
    try {
      // Check if the current account is the admin
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      const adminAddress = await studentContract.methods.admin().call();
      if (account.toLowerCase() !== adminAddress.toLowerCase()) {
        alert('Only the admin can assign teachers.');
        return;
      }
      console.log("admin: ",account);
      await studentFactoryContract.methods.assignTeacher(studentAccount, teacherAddress).send({ from: account });
      alert(`Teacher assigned successfully to student ${studentAccount}`);
    } catch (err) {
      console.error('Error assigning teacher:', err);
      alert('Failed to assign teacher');
    }
  };
  

  const deleteStudent = async (studentAccount, account) => {
    try {
      await studentFactoryContract.methods.deleteStudent(studentAccount).send({ from: account });
      alert(`Student ${studentAccount} deleted successfully`);
      loadAllStudents(); // Reload the students list
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student');
    }
  };

  const deleteTeacher = async (teacherAccount, account) => {
    try {
      await teacherFactoryContract.methods.deleteTeacher(teacherAccount).send({ from: account });
      alert(`Student ${teacherAccount} deleted successfully`);
      loadAllTeachers(); // Reload the teachers list
    } catch (err) {
      console.error('Error deleting teacher:', err);
      alert('Failed to delete teacher');
    }
  };

  const addCertificate = async (studentAccount, eventName, eventDate, fileHash, eventRemark) => {
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      
      await studentContract.methods.addCertificate(eventName, eventDate, fileHash, eventRemark).send({ from: account , gas:5000000});
      alert('Certificate added successfully.');
    } catch (err) {
      console.error('Error adding certificate:', err);
      alert('Failed to add certificate.');
    }
  };

  // New function to get all certificates for a student
  const getCertificates = async (studentAccount) => {
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      
      const certificates = await studentContract.methods.getCertificates().call();
      return certificates;
    } catch (err) {
      console.error('Error retrieving certificates:', err);
      alert('Failed to retrieve certificates.');
      return [];
    }
  };

  // New function to get a specific certificate for a student
  const getCertificate = async (studentAccount, fileHash) => {
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      
      const certificate = await studentContract.methods.getCertificate(fileHash).call();
      return certificate;
    } catch (err) {
      console.error('Error retrieving certificate:', err);
      alert('Failed to retrieve certificate.');
      return null;
    }
  };

  // New function to add an event remark
  const addEventRemark = async (studentAccount, fileHash, newRemark) => {
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      
      await studentContract.methods.addEventRemark(fileHash, newRemark).send({ from: account });
      alert('Event remark added successfully.');
    } catch (err) {
      console.error('Error adding event remark:', err);
      alert('Failed to add event remark.');
    }
  };

  // New function to add a spreadsheet
  const addSpreadSheet = async (teacherAccount, sheetlink, title) => {
    try {
      const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAccount).call();
      const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
      
      await teacherContract.methods.addSpreadSheet(sheetlink, title).send({ from: account, gas: 5000000 });
      alert('Spreadsheet added successfully.');
    } catch (err) {
      console.error('Error adding spreadsheet:', err);
      alert('Failed to add spreadsheet.');
    }
  };

  // Modify getSpreadSheets to fetch spreadsheets from Teacher contract
  const getSpreadSheets = async (teacherAccount) => {
    try {
      const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAccount).call();
      const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
      
      const spreadsheets = await teacherContract.methods.getSpreadSheets().call();
      return spreadsheets;
    } catch (err) {
      console.error('Error retrieving spreadsheets:', err);
      alert('Failed to retrieve spreadsheets.');
      return [];
    }
  };

  // New function to get a specific spreadsheet for a teacher
  const getSpreadSheet = async (teacherAccount, sheetlink) => {
    try {
      const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAccount).call();
      const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
      
      const spreadsheet = await teacherContract.methods.getSpreadSheet(sheetlink).call();
      return spreadsheet;
    } catch (err) {
      console.error('Error retrieving spreadsheet:', err);
      alert('Failed to retrieve spreadsheet.');
      return null;
    }
  };

  return (
    <StudentTeacherContext.Provider
      value={{
        students,
        teachers,
        loading,
        error,
        assignTeacher,
        deleteStudent,
        deleteTeacher,
        loadAllStudents,
        loadAllTeachers,
        addCertificate,
        getCertificates,
        getCertificate,
        addEventRemark,
        addSpreadSheet,
        getSpreadSheets,
        getSpreadSheet,
      }}
    >
      {children}
    </StudentTeacherContext.Provider>
  );
};

