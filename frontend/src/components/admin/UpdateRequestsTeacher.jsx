import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import web3 from '../../web3';
import Teacher from '../../contracts/Teacher.json';
import { useBlockchain } from '../../context/BlockchainContext';

function UpdateRequestsTeacher() {
    const {teacherFactoryContract,account}= useBlockchain();
    const [updateRequests, setUpdateRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadUpdateRequests();
    }, []);

    const loadUpdateRequests = async () => {
        try {
            const teacherAccounts = await teacherFactoryContract.methods.getTeachersWithUpdateRequests().call();
            const teachersWithDetails = await Promise.all(
                teacherAccounts.map(async (account) => {
                    const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(account).call();
                    const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
                    const id = await teacherContract.methods.id().call(); // Assuming there is an id method
                    const name = await teacherContract.methods.name().call(); // Assuming there is a name method
                    return { account, id, name }; // Collect the details
                })
            );
            setUpdateRequests(teachersWithDetails);
        } catch (error) {
            console.error("Error loading update requests:", error);
            setError("Failed to load update requests");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = (teacherAccount) => {
        navigate(`update-teacher/${teacherAccount}`); // Navigate to UpdateTeacherForm with account
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
                    {updateRequests.map((teacher, index) => (
                        <li key={index} className="mb-2">
                            <div>
                                <strong>Teacher ID:</strong> {teacher.id} {/* Display teacher ID */}
                            </div>
                            <div>
                                <strong>Name:</strong> {teacher.name} {/* Display teacher name */}
                            </div>
                            <div>
                                <strong>Account Number:</strong> {teacher.account} {/* Display account number */}
                            </div>
                            <button
                                onClick={() => handleUpdateClick(teacher.account)}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Update
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No teachers have requested updates.</p>
            )}
        </div>
    );
}

export default UpdateRequestsTeacher;
