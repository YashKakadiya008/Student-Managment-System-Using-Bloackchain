import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ students, deleteStudent,account }) => {
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleUpdateClick = (studentAccount) => {
    navigate(`update-student/${studentAccount}`);
  };

  const handleViewClick = (studentAccount) => {
    navigate(`view/${studentAccount}`);
  };

  const handleDeleteStudent = (studentAccount) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      deleteStudent(studentAccount,account);
    }
  };

  return (
    <table className="table-auto w-full text-left border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">ID</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Update</th>
          <th className="border px-4 py-2">Delete</th>
          <th className="border px-4 py-2">View</th>
        </tr>
      </thead>
      <tbody>
        {students && students.length > 0 ? (
          students.map((student) => (
            <tr key={`${student.account}-${student.id}`} className="hover:bg-gray-100">
              <td className="border px-4 py-2 whitespace-nowrap">{student.id}</td>
              <td className="border px-4 py-2 whitespace-nowrap">{student.name}</td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => handleUpdateClick(student.account)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteStudent(student.account)} 
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => handleViewClick(student.account)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center py-4">No students available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentCard;
