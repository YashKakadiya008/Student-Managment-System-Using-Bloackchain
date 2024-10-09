import React, { useState } from 'react';
import Student from '../contracts/Student.json';
import Teacher from '../contracts/Teacher.json';
import Web3 from 'web3';
import web3 from '../web3';

function AccountInput({ setRole, adminContract, studentFactoryContract, teacherFactoryContract, account, setAccount }) {
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Web3.utils.isAddress(account)) {
            setError('Invalid Ethereum address.');
            return;
        }

        const formattedAccount = Web3.utils.toChecksumAddress(account);  // Ensure proper address format

        try {
            // Admin check
            const adminAddress = await adminContract.methods.admin().call();
            if (formattedAccount === Web3.utils.toChecksumAddress(adminAddress)) {
                console.log('Admin found:', adminAddress);
                setRole('admin');
                return;
            }
        } catch (err) {
            console.log('Not an Admin:', err);
        }

        let isTeacher = false;
        let isStudent = false;

        try {
            // Teacher check
            const teacher = await teacherFactoryContract.methods.getTeacher(formattedAccount).call();
            const teacherContract = new web3.eth.Contract(Teacher.abi, teacher);
            const teacher_account = await teacherContract.methods.account().call();
            if (teacher_account === formattedAccount && teacher.account !== '0x0000000000000000000000000000000000000000') {
                console.log('Teacher found:', teacher);
                isTeacher = true;
            }
        } catch (err) {
            console.log('Not a Teacher:', err);
        }

        try {
            // Student check
            const student = await studentFactoryContract.methods.getStudent(formattedAccount).call();
            const studentContract = new web3.eth.Contract(Student.abi, student);
            const student_account = await studentContract.methods.account().call();
            if (student_account === formattedAccount && student.account !== '0x0000000000000000000000000000000000000000') {
                console.log('Student found:', student);
                isStudent = true;
            }
        } catch (err) {
            console.log('Not a Student:', err);
        }

        // Logic to decide role
        if (isTeacher) {
            setRole('teacher');
        } else if (isStudent) {
            setRole('student');
        } else {
            setError('Account not found in any role.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-teal-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                {/* Image at the top */}
                <div className="flex justify-center mb-6">
                    <img 
                        src="../../public/image/login-logo.png"  // Replace with your actual image path
                        alt="Admin Icon"
                        className="h-24 w-24"
                    />
                </div>

                {/* Admin Login Title */}
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                Enter your Ethereum account
                </h2>

                {/* Input form */}
                <form onSubmit={handleSubmit}>
                    {/* Account input field */}
                    <input
                        type="text"
                        placeholder="Enter Ethereum Address"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Error message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AccountInput;
