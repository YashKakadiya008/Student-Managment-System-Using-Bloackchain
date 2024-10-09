// import React, { useEffect, useState } from 'react';
// import web3 from '../../web3';
// import Student from '../../contracts/Student.json';
// import Teacher from '../../contracts/Teacher.json';
// import StudentCard from './StudentCard';

// const ViewStudent = ({ studentFactoryContract, teacherFactoryContract, account }) => {
//   const [students, setStudents] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true); // State for loading indicator

//   useEffect(() => {
//     loadAllStudents();
//     loadAllTeachers();
//   }, []);

//   const loadAllStudents = async () => {
//     try {
//       const studentAddresses = await studentFactoryContract.methods.getAllStudents().call();
//       const studentDetails = await Promise.all(
//         studentAddresses.map(async (address) => {
//           const studentContractAddress = await studentFactoryContract.methods.getStudent(address).call();
//           const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);

//           const id = await studentContract.methods.id().call();
//           const name = await studentContract.methods.name().call();
//           const age = await studentContract.methods.age().call();
//           const gmail = await studentContract.methods.gmail().call();
//           const mobileNo = await studentContract.methods.mobile_no().call();
//           const course = await studentContract.methods.course().call();
//           const remarks = await studentContract.methods.remarks().call();
//           const account = await studentContract.methods.account().call();
//           const teacherAddress = await studentContract.methods.teacher().call();
        
//           let isTeacherAssig ;
//           let teacher_name;
//           console.log("teacher : ",teacherAddress);
//           if(teacherAddress === "0x0000000000000000000000000000000000000000")
//           {
//             teacher_name = "NA"
//             isTeacherAssig=false;
//           }
//           else{
//             const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAddress).call();
//             const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
//             teacher_name = await teacherContract.methods.name().call();
//             isTeacherAssig=true;
//           }

//           return { id, name, age, gmail, mobileNo, course, remarks, account ,teacher_name,isTeacherAssig };
//         })
//       );

//       setStudents(studentDetails);
//     } catch (err) {
//       setError('Error loading student data.');
//     } finally {
//       setLoading(false); // Set loading to false after data fetch
//     }
//   };

//   const loadAllTeachers = async () => {
//     try {
//       const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
//       const teacherDetails = await Promise.all(
//         teacherAddresses.map(async (address) => {
//           console.log("teacher address :" ,address);
//           const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(address).call();
//           const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
//           const name = await teacherContract.methods.name().call();
//           const account = await teacherContract.methods.account().call();

//           return { name, account };
//         })
//       );
//       setTeachers(teacherDetails); // Set all existing teachers in state
//     } catch (err) {
//       console.error('Error loading teachers:', err);
//       setError('Error loading teacher data.');
//     }
//   };

//   const assignTeacher = async (studentAccount, teacherAddress) => {
//     const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
//     if (!teacherAddresses.includes(teacherAddress)) {
//       alert('Teacher does not exist in the system.');
//       return;
//     }

//     try {
//       const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
//       const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
//       await studentContract.methods.assignTeacher(teacherAddress).send({ from: account });
//       alert(`Teacher assigned successfully to student ${studentAccount}`);
//     } catch (err) {
//       console.error('Error assigning teacher:', err);
//       alert('Failed to assign teacher');
//     }
//   };

//   const deleteStudent = async (studentAccount) => {
//     try {
//       await studentFactoryContract.methods.deleteStudent(studentAccount).send({ from: account });
//       alert(`Student ${studentAccount} deleted successfully`);
//       loadAllStudents(); // Reload the students list
//     } catch (err) {
//       console.error('Error deleting student:', err);
//       alert('Failed to delete student');
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">View All Students</h2>

//       {loading && <div className="text-blue-500">Loading students...</div>} {/* Loading indicator */}

//       {error && <div className="text-red-500">{error}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {students.length > 0 ? (
//           <StudentCard students={students} assignTeacher={assignTeacher} deleteStudent={deleteStudent} teachers={teachers} account={account} />
//         ) : (
//           <div>No students found.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewStudent;


import React, { useEffect, useState } from 'react';
import web3 from '../../web3';
import Student from '../../contracts/Student.json';
import Teacher from '../../contracts/Teacher.json';
import StudentCard from './StudentCard';
import {useStudentTeacher} from '../../context/StudentTeacherContext';

const ViewStudent = () => {
  const {
    students,
    account,
        teachers,
        loading,
        error,
        assignTeacher,
        deleteStudent,
        loadAllStudents,
        loadAllTeachers
  } = useStudentTeacher();

  useEffect(() => {
    loadAllStudents();
    loadAllTeachers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">View All Students</h2>

      {loading && <div className="text-blue-500">Loading students...</div>} {/* Loading indicator */}

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length > 0 ? (
          <StudentCard students={students} assignTeacher={assignTeacher} deleteStudent={deleteStudent} teachers={teachers} account={account} />
        ) : (
          <div>No students found.</div>
        )}
      </div>
    </div>
  );
};

export default ViewStudent;
