import React, { useState, useEffect } from 'react';
import Student from "../../contracts/Student.json";
import { useParams } from 'react-router-dom';
import web3 from '../../web3';

const UpdateStudentForm = ({ studentFactoryContract, account }) => {
  const { studentAccount } = useParams(); // Extracting studentAccount from URL parameters
  const [studentContract, setStudentContract] = useState(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gmail, setGmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [course, setCourse] = useState('');
  const [admin, setAdmin] = useState(account); // Admin will be the account provided
  
  useEffect(() => {
    const loadStudentDetails = async () => {
      if (!studentAccount || !web3.utils.isAddress(studentAccount)) {
        console.error("Invalid or undefined student account.");
        return;
      }

      try {
        const studentAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
        const studentContractInstance = new web3.eth.Contract(Student.abi, studentAddress);
        setStudentContract(studentContractInstance);

        // Load student details from contract
        const studentId = await studentContractInstance.methods.id().call();
        const studentName = await studentContractInstance.methods.name().call();
        const studentAge = await studentContractInstance.methods.age().call();
        const studentGmail = await studentContractInstance.methods.gmail().call();
        const studentMobileNo = await studentContractInstance.methods.mobile_no().call();
        const studentCourse = await studentContractInstance.methods.course().call();

        // Set the state with the student details
        setId(studentId);
        setName(studentName);
        setAge(studentAge);
        setGmail(studentGmail);
        setMobileNo(studentMobileNo);
        setCourse(studentCourse);
      } catch (error) {
        console.error("Error loading student details:", error);
      }
    };

    loadStudentDetails();
  }, [account, studentFactoryContract, studentAccount]);

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (studentContract) {
      try {
        await studentContract.methods
          .updateDetails(id, name, parseInt(age), gmail, parseInt(mobileNo), course)
          .send({ from: admin, gas: 5000000 });
        alert('Student details updated successfully!');
      } catch (error) {
        console.error("Failed to update student details:", error);
        alert('Failed to update student details. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleUpdateStudent} className="space-y-4">
      <h2 className="text-2xl font-bold">Update Student Details (ID: {id})</h2>

      <div>
        <label>Id:</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Age:</label>
        <input
          value={age.toString()}
          onChange={(e) => setAge(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Mobile No:</label>
        <input
          value={mobileNo.toString()}
          onChange={(e) => setMobileNo(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Course:</label>
        <input
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Student
      </button>
    </form>
  );
};

export default UpdateStudentForm;
