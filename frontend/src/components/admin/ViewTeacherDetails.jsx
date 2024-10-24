import React, { useEffect } from 'react';
import TeacherCard from './TeacherCard';
import { useStudentTeacher } from '../../context/StudentTeacherContext';

const ViewTeacherDetails = () => {
  const {
    account,
    teachers,
    error,
    deleteTeacher,
    loadAllStudents,
    loadAllTeachers
  } = useStudentTeacher();

  useEffect(() => {
    loadAllStudents();
    loadAllTeachers();
  }, []);


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">View All Teachers</h2>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.length > 0
          ? <TeacherCard teachers={teachers} deleteTeacher={deleteTeacher} account={account} />
          : <div>No teachers found.</div>}
      </div>
    </div>
  );
};

export default ViewTeacherDetails;
