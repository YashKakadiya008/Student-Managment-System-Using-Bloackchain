import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import web3 from '../../web3';
import Student from '../../contracts/Student.json';

function UpdateRequestsStudent({ studentFactoryContract }) {
    const [updateRequests, setUpdateRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadUpdateRequests();
    }, []);

    const loadUpdateRequests = async () => {
        try {
            const studentAccounts = await studentFactoryContract.methods.getStudentsWithUpdateRequests().call();
            const studentsWithDetails = await Promise.all(
                studentAccounts.map(async (account) => {
                    const studentContractAddress = await studentFactoryContract.methods.getStudent(account).call();
                    const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
                    const id = await studentContract.methods.id().call(); // Assuming there is an id method
                    const name = await studentContract.methods.name().call(); // Assuming there is a name method
                    return { account, id, name }; // Collect the details
                })
            );
            setUpdateRequests(studentsWithDetails);
        } catch (error) {
            console.error("Error loading update requests:", error);
            setError("Failed to load update requests");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = (studentAccount) => {
        navigate(`update-student/${studentAccount}`); // Navigate to UpdateStudentForm with account
    };

    if (loading) {
        return <div>Loading update requests...</div>;
    }

    if (error) {
        return <div className="text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="max-w-md mx-auto p-5 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Update Requests</h1>
            {updateRequests.length > 0 ? (
                <ul>
                    {updateRequests.map((student, index) => (
                        <li key={index} className="mb-2">
                            <div>
                                <strong>Student ID:</strong> {student.id} {/* Display student ID */}
                            </div>
                            <div>
                                <strong>Name:</strong> {student.name} {/* Display student name */}
                            </div>
                            <div>
                                <strong>Account Number:</strong> {student.account} {/* Display account number */}
                            </div>
                            <button
                                onClick={() => handleUpdateClick(student.account)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No students have requested updates.</p>
            )}
        </div>
    );
}

export default UpdateRequestsStudent;
