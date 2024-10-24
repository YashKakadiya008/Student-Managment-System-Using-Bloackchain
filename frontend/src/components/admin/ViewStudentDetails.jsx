import React, { useEffect, useState } from 'react';
import StudentCard from './StudentCard';
import { useStudentTeacher } from '../../context/StudentTeacherContext';

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

      {loading && <div className="text-blue-500">Loading students...</div>}
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
