import React from 'react';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import AccountInput from './components/AccountInput';
import AddStudentForm from './components/admin/AddStudentForm';
import ViewStudentDetails from './components/admin/ViewStudentDetails';
import AddTeacherForm from './components/admin/AddTeacherForm';
import ViewTeacherDetails from './components/admin/ViewTeacherDetails';
import UpdateStudentForm from './components/admin/UpdateStudentForm';
import StudentProfile from './components/student/StudentProfile';
import EventAchievement from './components/student/EventAchievement';
import Result from './components/student/Result';
import TeacherProfile from './components/teacher/Teacherprofile';
import AssignedStudents from './components/teacher/AssignedStudents';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import View from './components/admin/View';
import { useBlockchain } from './context/BlockchainContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UpdateRequestsStudent from './components/admin/UpdateRequestsStudent';
import UpdateRequestsTeacher from './components/admin/UpdateRequestsTeacher';
import UpdateTeacherForm from './components/admin/UpdateTeacherForm';
import AdminCreateSemester from './components/admin/AdminCreateSemester';
import AddResult from './components/teacher/AddResult';
import ViewStudentEvent from './components/teacher/ViewStudentEvents';
import ManageSpreadsheets from './components/teacher/ManageSpreadSheets';
import GoogleSpreadSheet from './components/GoogleSpreadSheet';
import ViewSpreadSheet from './components/student/ViewSpreadSheet';

function App() {
    const navigate = useNavigate();
    const {
        account,
        setAccount,
        adminContract,

        studentFactoryContract,

        teacherFactoryContract,

        loading,

        networkError,

        role,
        setRole,
        logout
    } = useBlockchain();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return <div>Loading blockchain data...</div>;
    }

    if (networkError) {
        return (
            <div>
                <p className="text-red-500 font-bold">Network Error: {networkError}</p>
                <p>Please make sure your blockchain node is running and the contracts are deployed.</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={role === '' ?
                    <AccountInput
                        setRole={(r) => {
                            setRole(r);
                            localStorage.setItem('role', r);
                        }}
                        setAccount={(acc) => {
                            setAccount(acc);
                            localStorage.setItem('account', acc);
                        }}
                        adminContract={adminContract}
                        studentFactoryContract={studentFactoryContract}
                        teacherFactoryContract={teacherFactoryContract}
                        account={account}
                    /> :
                    <Navigate to={`/${role}`} />}
            />
            <Route
                path="/admin"
                element={role === 'admin' ? <AdminDashboard handleLogout={handleLogout} /> : <Navigate to="/" />}
            >
                <Route index element={<Home />} />
                <Route path="add-student" element={<AddStudentForm studentFactoryContract={studentFactoryContract} account={account} />} />
                <Route path="view-students" element={<ViewStudentDetails studentFactoryContract={studentFactoryContract} teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="add-teacher" element={<AddTeacherForm teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="view-teachers" element={<ViewTeacherDetails teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="create-semester" element={<AdminCreateSemester />} />
                <Route path="update-requests-student" element={<UpdateRequestsStudent studentFactoryContract={studentFactoryContract} />} />
                <Route path="update-requests-teacher" element={<UpdateRequestsTeacher tacherFactoryContract={teacherFactoryContract} />} />
                <Route path="view-students/view/:studentAccount" element={<View />} />
                <Route
                    path="view-teachers/update-teacher/:teacherAccount"
                    element={
                        <ProtectedRoute
                            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
                            redirectPath="/" // Redirect unauthorized users to the home page
                        >
                            <UpdateTeacherForm teacherFactoryContract={teacherFactoryContract} account={account} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="update-requests-teacher/update-teacher/:teacherAccount"
                    element={
                        <ProtectedRoute
                            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
                            redirectPath="/" // Redirect unauthorized users to the home page
                        >
                            <UpdateTeacherForm teacherFactoryContract={teacherFactoryContract} account={account} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="view-students/update-student/:studentAccount"
                    element={
                        <ProtectedRoute
                            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
                            redirectPath="/" // Redirect unauthorized users to the home page
                        >
                            <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="view-students/view/:studentAccount/update-student/:studentAccount"
                    element={
                        <ProtectedRoute
                            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
                            redirectPath="/" // Redirect unauthorized users to the home page
                        >
                            <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="update-requests-student/update-student/:studentAccount"
                    element={
                        <ProtectedRoute
                            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
                            redirectPath="/" // Redirect unauthorized users to the home page
                        >
                            <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route
                path="/teacher"
                element={role === 'teacher' ? <TeacherDashboard handleLogout={handleLogout} /> : <Navigate to="/" />}
            >
                <Route index element={<Home />} />
                <Route path="teacher-profile" element={<TeacherProfile teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="assigned-student" element={<AssignedStudents studentFactoryContract={studentFactoryContract} account={account} />} />
                <Route path="assigned-student/view-event/:studentAccount" element={<ViewStudentEvent />} />
                <Route path="add-result" element={<AddResult />} />
                <Route path="manage-spreadsheets" element={<ManageSpreadsheets />} />
                <Route path="manage-spreadsheets/goolespreadsheet/:sheetlink" element={<GoogleSpreadSheet />} />
            </Route>
            <Route
                path="/student"
                element={role === 'student' ?
                    <StudentDashboard handleLogout={handleLogout} /> :
                    <Navigate to="/" />} >
                <Route index element={<Home />} />
                <Route path="student-profile" element={<StudentProfile studentFactoryContract={studentFactoryContract} account={account} />} />
                <Route path="student-event-achievement" element={<EventAchievement />} />
                <Route path="student-result" element={<Result />} />
                <Route path="view-spreadsheet" element={<ViewSpreadSheet />} />
                <Route path="view-spreadsheet/goolespreadsheet/:sheetlink" element={<GoogleSpreadSheet />} />
            </Route>


        </Routes>
    );
}

export default App;
