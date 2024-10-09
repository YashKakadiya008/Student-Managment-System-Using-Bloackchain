import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherCard = ({ teachers,deleteTeacher,account }) => {
  const navigate = useNavigate();

  const handleUpdateClick = (teacherAccount) => {
    navigate(`update-teacher/${teacherAccount}`);
  };

  const handleDeleteTeacher = (teacherAccount) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this teacher?');
    if (confirmDelete) {
      deleteTeacher(teacherAccount,account);
    }
  };

  return (
    <table className="table-auto w-full text-left border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2">ID</th>
        <th className="border px-4 py-2">Name</th>
        <th className="border px-4 py-2">Subject</th>
        <th className="border px-4 py-2">Email</th>
        <th className="border px-4 py-2">Account</th>
        <th className="border px-4 py-2">Update</th>
        <th className="border px-4 py-2">Delete</th>
      </tr>
    </thead>
    <tbody>
      {teachers.map((teacher, index) => (
        <tr key={index} className="hover:bg-gray-100">
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.id}</td>
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.name}</td>
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.subject}</td>
          <td className="border px-4 py-2 ">{teacher.email}</td>
          <td className="border px-4 py-2">{teacher.account}</td>
          <td className="border px-4 py-2">
                <button
                  onClick={() => handleUpdateClick(teacher.account)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteTeacher(teacher.account)} 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
        </tr>
      ))}
    </tbody>
  </table>
  );  
};

export default TeacherCard;
