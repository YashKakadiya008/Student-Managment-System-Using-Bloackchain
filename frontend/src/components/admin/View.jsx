// import React, { useState,useEffect } from 'react';
// import Student from "../../contracts/Student.json";
// import Teacher from "../../contracts/Teacher.json";
// import { useParams } from 'react-router-dom';
// import { useBlockchain } from '../../context/BlockchainContext';
// import { useStudentTeacher } from '../../context/StudentTeacherContext';
// import web3 from '../../web3';
// import { useNavigate } from 'react-router-dom';

// const View = () => {
//   const { studentAccount } = useParams();
//   const [studentContract, setStudentContract] = useState(null);
//   const [id, setId] = useState('');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [gmail, setGmail] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [course, setCourse] = useState('');
//   const [isTeacherAssiged ,setIsTeacherAssiged] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState({});
//   const [teacher_name,setTeacher_name] = useState('');
//   const navigate = useNavigate(); 
//   // const [admin, setAdmin] = useState(account);
//   const {
//         account,
//         studentFactoryContract,
//         teacherFactoryContract,
// } = useBlockchain();

//   const {
//     students,
//     teachers,
//     loading,
//     error,
//     assignTeacher,
//     deleteStudent,
//     loadAllStudents,
//     loadAllTeachers
//   } = useStudentTeacher();

//   useEffect(() => {
//     const loadStudentDetails = async () => {
//       if (!studentAccount || !web3.utils.isAddress(studentAccount)) {
//         console.error("Invalid or undefined student account.");
//         return;
//       }

//       try {
//         const studentAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
//         const studentContractInstance = new web3.eth.Contract(Student.abi, studentAddress);
//         setStudentContract(studentContractInstance);

//         // Load student details from contract
//         const studentId = await studentContractInstance.methods.id().call();
//         const studentName = await studentContractInstance.methods.name().call();
//         const studentAge = await studentContractInstance.methods.age().call();
//         const studentGmail = await studentContractInstance.methods.gmail().call();
//         const studentMobileNo = await studentContractInstance.methods.mobile_no().call();
//         const studentCourse = await studentContractInstance.methods.course().call();
//         const teacherAddress = await studentContractInstance.methods.teacher().call();

//         let isTeacherAssig ;
//         // console.log("teacher : ",teacherAddress);
//         if(teacherAddress === "0x0000000000000000000000000000000000000000")
//         {
//              setTeacher_name('NA');
//              isTeacherAssig=false;
//         }
//         else{
//           const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAddress).call();
//           const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
//           const  _teacher_name = await teacherContract.methods.name().call();
//           setTeacher_name(_teacher_name);
//           isTeacherAssig=true;
//         }

//         // Set the state with the student details
//         setId(studentId);
//         setName(studentName);
//         setAge(studentAge);
//         setGmail(studentGmail);
//         setMobileNo(studentMobileNo);
//         setCourse(studentCourse);
//         setIsTeacherAssiged(isTeacherAssig);
//       } catch (error) {
//         console.error("Error loading student details:", error);
//       }
//     };

//     loadStudentDetails();
//   }, [account, studentFactoryContract, studentAccount]);

//   const handleUpdateClick = (studentAccount) => {
//     navigate(`update-student/${studentAccount}`);
//   };

//   const handleAssignTeacher = (studentAccount) => {
//     const teacherAddress = selectedTeacher[studentAccount]; // Get the selected teacher for this student
//     if (teacherAddress) {
//       assignTeacher(studentAccount, teacherAddress);
//     } else {
//       alert('Please select a teacher.');
//     }
//   };

//   const handleUpdateTeacher = (studentAccount) => {
//     const teacherAddress = selectedTeacher[studentAccount]; // Get selected teacher
//     if (!teacherAddress) {
//       alert('Please select a teacher.');
//       return;
//     }

//     const confirmUpdate = window.confirm('Are you sure you want to update the assigned teacher?');
//     if (confirmUpdate) {
//       assignTeacher(studentAccount, teacherAddress,account);
//     }
//   };

//   const handleDeleteStudent = (studentAccount) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this student?');
//     if (confirmDelete) {
//       deleteStudent(studentAccount,account);
//     }
//   };

//   return (
//     <table className="table-auto w-full text-left border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="border px-4 py-2">ID</th>
//           <th className="border px-4 py-2">Name</th>
//           <th className="border px-4 py-2">Age</th>
//           <th className="border px-4 py-2">Email</th>
//           <th className="border px-4 py-2">Mobile No</th>
//           <th className="border px-4 py-2">Course</th>
//           <th className="border px-4 py-2">Teacher</th>
//           <th className="border px-4 py-2">Assign/Update Teacher</th>
//           <th className="border px-4 py-2">Update</th>
//           <th className="border px-4 py-2">Delete</th>
//         </tr>
//       </thead>
//       <tbody>
//         {studentAccount ? (
//             <tr className="hover:bg-gray-100">
//               <td className="border px-4 py-2 whitespace-nowrap">{id}</td>
//               <td className="border px-4 py-2 whitespace-nowrap">{name}</td>
//               <td className="border px-4 py-2 whitespace-nowrap">{age.toString()}</td>
//               <td className="border px-4 py-2">{gmail}</td>
//               <td className="border px-4 py-2">{mobileNo.toString()}</td>
//               <td className="border px-4 py-2 whitespace-nowrap">{course}</td>
//               <td className="border px-4 py-2 whitespace-nowrap">{teacher_name}</td> 

//               <td className="border px-4 py-2">
//                 <div className="flex items-center">
//                   <select
//                     onChange={(e) => setSelectedTeacher({ ...selectedTeacher, [studentAccount]: e.target.value })}
//                     value={selectedTeacher[studentAccount] || ''}
//                     className="border border-gray-400 rounded px-2 py-1"
//                   >
//                     <option value="">Select Teacher</option>
//                     {teachers.map((teacher) => (
//                       <option key={teacher.account} value={teacher.account}>{teacher.name}</option>
//                     ))}
//                   </select>
//                   {/* Show "Assign" if no teacher is assigned, otherwise show "Update Teacher" */}
//                   {isTeacherAssiged ? (
//                     <button
//                       onClick={() => handleUpdateTeacher(studentAccount)}
//                       className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
//                     >
//                       Update
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleAssignTeacher(studentAccount)}
//                       className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
//                     >
//                       Assign
//                     </button>
//                   )}
//                 </div>
//               </td>

//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() => handleUpdateClick(studentAccount)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   Update
//                 </button>
//               </td>

//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() => handleDeleteStudent(studentAccount)} 
//                   className="bg-red-500 text-white px-4 py-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//         ) : (
//           <tr>
//             <td colSpan="10" className="text-center py-4">No students available</td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   );
// };

// export default View;

import React, { useState, useEffect } from 'react';
import Student from "../../contracts/Student.json";
import Teacher from "../../contracts/Teacher.json";
import { useParams } from 'react-router-dom';
import { useBlockchain } from '../../context/BlockchainContext';
import { useStudentTeacher } from '../../context/StudentTeacherContext';
import web3 from '../../web3';
import { useNavigate } from 'react-router-dom';

const View = () => {
  const { studentAccount } = useParams();
  const [studentContract, setStudentContract] = useState(null);
  const [photo, setPhoto] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gmail, setGmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [course, setCourse] = useState('');
  const [isTeacherAssiged, setIsTeacherAssiged] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [teacher_name, setTeacher_name] = useState('');
  const navigate = useNavigate();
  // const [admin, setAdmin] = useState(account);
  const {
    account,
    studentFactoryContract,
    teacherFactoryContract,
  } = useBlockchain();

  const {
    students,
    teachers,
    loading,
    error,
    assignTeacher,
    deleteStudent,
    loadAllStudents,
    loadAllTeachers
  } = useStudentTeacher();

 useEffect(()=>{
  loadAllTeachers()
  console.log("teachers:",teachers);
 },[]);

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
        const studentPhoto = await studentContractInstance.methods.ipfsHash_photo().call();
        const studentId = await studentContractInstance.methods.id().call();
        const studentName = await studentContractInstance.methods.name().call();
        const studentAge = await studentContractInstance.methods.age().call();
        const studentGmail = await studentContractInstance.methods.gmail().call();
        const studentMobileNo = await studentContractInstance.methods.mobile_no().call();
        const studentCourse = await studentContractInstance.methods.course().call();
        const teacherAddress = await studentContractInstance.methods.teacher().call();

        let isTeacherAssig;
        // console.log("teacher : ",teacherAddress);
        if (teacherAddress === "0x0000000000000000000000000000000000000000") {
          setTeacher_name('NA');
          isTeacherAssig = false;
        }
        else {
          const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAddress).call();
          const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
          const _teacher_name = await teacherContract.methods.name().call();
          setTeacher_name(_teacher_name);
          isTeacherAssig = true;
        }

        // Set the state with the student details
        setPhoto(studentPhoto);
        setId(studentId);
        setName(studentName);
        setAge(studentAge);
        setGmail(studentGmail);
        setMobileNo(studentMobileNo);
        setCourse(studentCourse);
        setIsTeacherAssiged(isTeacherAssig);
      } catch (error) {
        console.error("Error loading student details:", error);
      }
    };

    loadStudentDetails();
  }, [account, studentFactoryContract, studentAccount]);

  const handleUpdateClick = (studentAccount) => {
    navigate(`update-student/${studentAccount}`);
  };

  const handleAssignTeacher = (studentAccount) => {
    const teacherAddress = selectedTeacher[studentAccount]; // Get the selected teacher for this student
    if (teacherAddress) {
      assignTeacher(studentAccount, teacherAddress); // Make sure `account` is passed here
    } else {
      alert('Please select a teacher.');
    }
  };
  

  const handleUpdateTeacher = (studentAccount) => {
    const teacherAddress = selectedTeacher[studentAccount]; // Get selected teacher
    if (!teacherAddress) {
      alert('Please select a teacher.');
      return;
    }
   

    const confirmUpdate = window.confirm('Are you sure you want to update the assigned teacher?');
    if (confirmUpdate) {
      assignTeacher(studentAccount, teacherAddress, account);
    }
  };
  

  const handleDeleteStudent = (studentAccount) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      deleteStudent(studentAccount, account);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto p-6 bg-gray-100 rounded shadow-md">
    <h2 className="text-xl font-bold mb-4 text-center">Student Information</h2>
    
    {/* Photo positioned in the top-right corner */}
    <div className="absolute top-14 right-12 m-4">
  {photo ? (
    <img
      src={`https://gateway.pinata.cloud/ipfs/${photo}`}
      alt="Uploaded to IPFS"
      className="w-32 h-36 rounded object-cover"
    />
  ) : (
    // Placeholder frame for photo
    <div className="w-32 h-36 rounded border-2 border-gray-300 flex items-center justify-center">
      <span className="text-gray-400">No Photo</span>
    </div>
  )}
</div>
  
    <div>
      <div className="mb-2">
        <strong>Id: </strong> {id}
      </div>
      <div className="mb-2">
        <strong>Name: </strong> {name}
      </div>
      <div className="mb-2">
        <strong>Age: </strong> {age.toString()}
      </div>
      <div className="mb-2">
        <strong>Email: </strong> {gmail}
      </div>
      <div className="mb-2">
        <strong>Mobile No: </strong> {mobileNo.toString()}
      </div>
      <div className="mb-2">
        <strong>Course: </strong> {course}
      </div>
      <div className="mb-2">
        <strong>Teacher: </strong> {teacher_name}
      </div>
  
      <div className="my-4">
        <select
          onChange={(e) => setSelectedTeacher({ ...selectedTeacher, [studentAccount]: e.target.value })}
          value={selectedTeacher[studentAccount] || ''}
          className="border border-gray-400 p-2 rounded w-full"
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.account} value={teacher.account}>
              {teacher.name}
            </option>
          ))}
        </select>
        {/* Show "Assign" if no teacher is assigned, otherwise show "Update Teacher" */}
        {isTeacherAssiged ? (
          <button
            onClick={() => handleUpdateTeacher(studentAccount)}
            className="bg-yellow-500 text-white mt-2 p-2 w-full rounded"
          >
            Update
          </button>
        ) : (
          <button
            onClick={() => handleAssignTeacher(studentAccount)}
            className="bg-blue-500 text-white mt-2 p-2 w-full rounded"
          >
            Assign
          </button>
        )}
      </div>
  
      <div className="flex justify-between space-x-4">
        <button
          onClick={() => handleUpdateClick(studentAccount)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Student
        </button>
        <button
          onClick={handleDeleteStudent}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete Student
        </button>
      </div>
    </div>
  </div>  
  );
};

export default View;


