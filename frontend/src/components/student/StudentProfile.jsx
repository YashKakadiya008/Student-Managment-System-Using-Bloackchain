import React, { useEffect, useState } from "react";
import web3 from '../../web3';
import Student from '../../contracts/Student.json';
import { useBlockchain } from '../../context/BlockchainContext';

function StudentProfile() {
  const { studentFactoryContract, account } = useBlockchain();
  const [studentContract, setStudentContract] = useState(null);
  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsRequested, setDetailsRequested] = useState(false);

  useEffect(() => {
    loadStudent();
  }, []);

  useEffect(() => {
    if (studentContract) {
      loadStudentDetails();
    }
  }, [studentContract]);

  const loadStudent = async () => {
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(account).call();
      const student_Contract = new web3.eth.Contract(Student.abi, studentContractAddress);
      setStudentContract(student_Contract);
    } catch (error) {
      console.error("Error loading student contract:", error);
      setError("Failed to load student contract");
    } finally {
      setLoading(false);
    }
  }

  const loadStudentDetails = async () => {
    try {
      const [id, name, age, gmail, mobileNo, course, remarks, photo, detailsRequestedValue] = await Promise.all([
        studentContract.methods.id().call(),
        studentContract.methods.name().call(),
        studentContract.methods.age().call(),
        studentContract.methods.gmail().call(),
        studentContract.methods.mobile_no().call(),
        studentContract.methods.course().call(),
        studentContract.methods.remarks().call(),
        studentContract.methods.ipfsHash_photo().call(),
        studentContract.methods.detailsRequested().call()
      ]);

      const studentData = {
        id,
        name,
        age,
        gmail,
        mobileNo,
        course,
        remarks,
        photo
      };

      setStudentDetails(studentData);
      setDetailsRequested(detailsRequestedValue);
    } catch (error) {
      console.error("Error loading student details:", error);
      setError("Failed to load student details");
    } finally {
      setLoading(false);
    }
  }

  const requestUpdate = async () => {
    try {
      await studentContract.methods.requestDetailsUpdate().send({ from: account });
      setDetailsRequested(true);
    } catch (error) {
      console.error("Error requesting update:", error);
      setError("Failed to request update");
    }
  }

  if (loading) {
    return <div>Loading student data...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="relative max-w-xl mx-auto p-6 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Student Information</h2>

      <div className="absolute top-14 right-12 m-4">
        {studentDetails.photo ? (
          <img
            src={`https://gateway.pinata.cloud/ipfs/${studentDetails.photo}`}
            alt="Uploaded to IPFS"
            className="w-32 h-38 rounded object-cover"
          />
        ) : (
          <div className="w-32 h-38 rounded border-2 border-gray-300 flex items-center justify-center">
            <span className="text-gray-400">No Photo</span>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2">
          <strong>Id: </strong> {studentDetails.id}
        </div>
        <div className="mb-2">
          <strong>Name: </strong> {studentDetails.name}
        </div>
        <div className="mb-2">
          <strong>Age: </strong> {studentDetails.age ? studentDetails.age.toString() : 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Email: </strong> {studentDetails.gmail}
        </div>
        <div className="mb-2">
          <strong>Mobile No: </strong> {studentDetails.mobileNo ? studentDetails.mobileNo.toString() : 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Course: </strong> {studentDetails.course}
        </div>
        <div className="mb-2">
          <strong>Remark: </strong> {studentDetails.remarks}
        </div>

        <button
          className={`mt-4 p-2 w-full text-white ${detailsRequested ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={requestUpdate}
          disabled={detailsRequested}
        >
          {detailsRequested ? "Update Requested" : "Request Details Update"}
        </button>

      </div>
    </div>
  );
}

export default StudentProfile;
