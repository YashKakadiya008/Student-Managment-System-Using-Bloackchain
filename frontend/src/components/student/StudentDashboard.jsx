import React from "react";
import Dashboard from "../Dashboard";

const studentLinks = [
    { to: 'student-profile', label: 'Profile' },
    { to: 'student-event-achievement', label: 'Event/Achievement'},
    { to: 'student-result', label: 'Semester Result'},
    { to: 'view-spreadsheet', label: 'View Spread Sheet'}
];

function StudentDashboard({handleLogout}) {
    return (
        <Dashboard 
            role="student" 
            links={studentLinks} 
            handleLogout={handleLogout} 
        />
    );
}

export default StudentDashboard;

