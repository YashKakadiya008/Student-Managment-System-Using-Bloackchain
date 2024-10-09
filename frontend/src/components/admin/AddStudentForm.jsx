import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageUploadForm from '../ImageUploadForm';
import { useIpfs } from '../../context/IpfsContext';

function AddStudentForm({ studentFactoryContract, account }) {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentGmail, setStudentGmail] = useState("");
  const [studentMobileNo, setStudentMobileNo] = useState("");
  const [studentCourse, setStudentCourse] = useState("");
  const [studentAccount, setStudentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { photoHash,setPhotoHash} = useIpfs();

  const addStudent = async (photo,id, name, age, gmail, mobile_no, course, accounts) => {
    if (!isValidAge(age) || !isValidMobileNo(mobile_no)) {
      setError("Invalid age or mobile number.");
      return;
    }
    
    setLoading(true);
    try {
      await studentFactoryContract.methods.createStudent(photo,id, name, parseInt(age), gmail, parseInt(mobile_no), course, accounts).send({ from: account, gas: 5000000 });
      console.log("Student added successfully");
     
      setPhotoHash("");
      setStudentId("");
      setStudentName("");
      setStudentAge("");
      setStudentGmail("");
      setStudentMobileNo("");
      setStudentCourse("");
      setStudentAccount("");
      setError("");
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidAge = (age) => age > 0 && age < 150;
  const isValidMobileNo = (mobileNo) => /^[0-9]+$/.test(mobileNo);

  const handleSubmit = (event) => {
    event.preventDefault();
    addStudent(photoHash,studentId, studentName, studentAge, studentGmail, studentMobileNo, studentCourse, studentAccount);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Student</h2>
      {error && <div className="text-red-500">{error}</div>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Student Id"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          placeholder="Student Age"
          value={studentAge}
          onChange={(e) => setStudentAge(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Student Gmail"
          value={studentGmail}
          onChange={(e) => setStudentGmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="number"
          placeholder="Student Mobile No"
          value={studentMobileNo}
          onChange={(e) => setStudentMobileNo(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Student Course"
          value={studentCourse}
          onChange={(e) => setStudentCourse(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Student Account"
          value={studentAccount}
          onChange={(e) => setStudentAccount(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <ImageUploadForm/>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}

AddStudentForm.propTypes = {
  studentFactoryContract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default AddStudentForm;
