import React from "react";
import Dashboard from "../Dashboard";

const teacherLinks = [
    { to: 'teacher-profile', label : 'Profile'},
    { to: 'assigned-student', label: 'Students' },
    { to: 'add-result' , label: 'Add Result'},
    { to: 'manage-spreadsheets', label: 'Add Spreadsheet'}
];

function TeacherDashboard({handleLogout}) {
    return (
        <Dashboard 
            role="teacher" 
            links={teacherLinks} 
            handleLogout={handleLogout} 
        />
    );
}

export default TeacherDashboard;

