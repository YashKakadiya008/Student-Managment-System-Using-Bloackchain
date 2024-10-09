import React, { useState, useEffect } from 'react';
import web3 from '../../web3';
import Student from '../../contracts/Student.json';
import { useNavigate } from 'react-router-dom';


function AssignedStudents({ teacherFactoryContract, studentFactoryContract, account }) {
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarksInput, setRemarksInput] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  useEffect(() => {
    if (assignedStudents.length > 0) {
      loadAllStudents();
    }
  }, [assignedStudents]);

  const fetchAssignedStudents = async () => {
    setLoading(true);
    try {
      const studentAccounts = await studentFactoryContract.methods.getAllStudents().call();
      const studentsForTeacher = [];

      for (let i = 0; i < studentAccounts.length; i++) {
        const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccounts[i]).call();
        const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
        const assign_teacher = await studentContract.methods.teacher().call();
        
        if (assign_teacher === account) {
          studentsForTeacher.push(studentContract);
        }
      }

      setAssignedStudents(studentsForTeacher);
    } catch (error) {
      console.error("Error fetching assigned students:", error);
      setError('Error fetching assigned students.'); 
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    setLoading(true);
    try {
      const studentDetails = await Promise.all(
        assignedStudents.map(async (address) => {
          const id = await address.methods.id().call();
          const name = await address.methods.name().call();
          const age = await address.methods.age().call();
          const gmail = await address.methods.gmail().call();
          const mobileNo = await address.methods.mobile_no().call();
          const course = await address.methods.course().call();
          const remarks = await address.methods.remarks().call();
          const studentAccount = await address.methods.account().call();

          return { id, name, age, gmail, mobileNo, course, remarks, studentAccount };
        })
      );

      setStudents(studentDetails);
    } catch (err) {
      console.error('Error loading student data:', err);
      setError('Error loading student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkChange = (studentAccount, value) => {
    setRemarksInput((prevState) => ({
      ...prevState,
      [studentAccount]: value
    }));
  };

  const submitRemark = async (studentAccount) => {
    const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
    const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
    const remark = remarksInput[studentAccount];

    try {
      await studentContract.methods.addRemarks(remark).send({ from: account });
      
      // Update local state to reflect the new remark
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.studentAccount === studentAccount
            ? { ...student, remarks: remark }
            : student
        )
      );

      alert('Remark added successfully');
    } catch (error) {
      console.error('Error adding remark:', error);
      alert('Failed to add remark');
    }
  };

  const handleUpdateClick = (studentAccount) => {
    navigate(`view-event/${studentAccount}`);
  };

  if (loading) {
    return <p>Loading assigned students...</p>;
  }

  if (error) {
    return <p>{error}</p>; 
  }

  if (assignedStudents.length === 0) {
    return <p>No students assigned to you yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Age</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Mobile No</th>
            <th className="border px-4 py-2">Course</th>
            <th className="border px-4 py-2">Student Account</th>
            <th className="border px-4 py-2">Remarks</th>
            <th className="border px-4 py-2">Add/Edit Remark</th>
            <th className="border px-4 py-2">Event</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={`${student.studentAccount}-${student.id}`} className="hover:bg-gray-100">
                <td className="border px-4 py-2 whitespace-nowrap">{student.id}</td>
                <td className="border px-4 py-2 whitespace-nowrap">{student.name}</td>
                <td className="border px-4 py-2 whitespace-nowrap">{student.age.toString()}</td>
                <td className="border px-4 py-2">{student.gmail}</td>
                <td className="border px-4 py-2">{student.mobileNo.toString()}</td>
                <td className="border px-4 py-2 whitespace-nowrap">{student.course}</td>
                <td className="border px-4 py-2">{student.studentAccount}</td>
                <td className="border px-4 py-2">{student.remarks}</td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={remarksInput[student.studentAccount] || ''}
                    onChange={(e) => handleRemarkChange(student.studentAccount, e.target.value)}
                    className="border px-2 py-1"
                    placeholder="Add a remark"
                  />
                  <button
                    onClick={() => submitRemark(student.studentAccount)}
                    className="bg-blue-500 text-white px-4 py-2 ml-2"
                  >
                    Submit
                  </button>
                </td>
                <td className="border px-4 py-2">
                <button
          onClick={() => handleUpdateClick(student.studentAccount)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Event
        </button>
        </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4">No students available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssignedStudents;
