import React, { useEffect, useState } from "react";
import web3 from '../../web3';
import Teacher from '../../contracts/Teacher.json';
import { useBlockchain } from '../../context/BlockchainContext';

function TeacherProfile() {
    const {teacherFactoryContract, account } = useBlockchain();
    const [teacherContract, setTeacherContract] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [detailsRequested, setDetailsRequested] = useState(false);

    // Load teacher contract on component mount
    useEffect(() => {
        loadTeacher();
    }, []);

    // Load teacher details when teacherContract is set
    useEffect(() => {
        if (teacherContract) {
            loadTeacherDetails();
        }
    }, [teacherContract]);

    const loadTeacher = async () => {
        try {
            const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(account).call();
            const teacher_Contract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
            setTeacherContract(teacher_Contract);
        } catch (error) {
            console.error("Error loading teacher contract:", error);
            setError("Failed to load teacher contract");
        } finally {
            setLoading(false);
        }
    }

    const loadTeacherDetails = async () => {
        try {
            const [id, name, subject, gmail,account,photo, detailsRequestedValue] = await Promise.all([
                teacherContract.methods.id().call(),
                teacherContract.methods.name().call(),
                teacherContract.methods.subject().call(),
                teacherContract.methods.gmail().call(),
                teacherContract.methods.account().call(),
                teacherContract.methods.ipfsHash_photo().call(),
                teacherContract.methods.detailsRequested().call()
            ]);

            console.log("photo : ",photo);

            // Save the values in a single constant as an object
            const teacherData = {
                id,
                name,
                subject,
                gmail,
                account,
                photo
            };

            setTeacherDetails(teacherData);
            setDetailsRequested(detailsRequestedValue);
        } catch (error) {
            console.error("Error loading teacher details:", error);
            setError("Failed to load teacher details");
        } finally {
            setLoading(false);
        }
    }

    const requestUpdate = async () => {
      try {
          await teacherContract.methods.requestDetailsUpdate().send({ from: account });
          setDetailsRequested(true); // Disable the button after update is requested (No change here)
      } catch (error) {
          console.error("Error requesting update:", error);
          setError("Failed to request update");
      }
  }


    // Render loading state, error messages, or teacher details
    if (loading) {
        return <div>Loading teacher data...</div>;
    }

    if (error) {
        return <div className="text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="relative max-w-xl mx-auto p-6 bg-gray-100 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">Teacher Details</h2>
        
        {/* Photo positioned in the top-right corner */}
        <div className="absolute top-15 right-16 m-auto">
      {teacherDetails.photo ? (
        <img
          src={`https://gateway.pinata.cloud/ipfs/${teacherDetails.photo}`}
          alt="Uploaded to IPFS"
          className="w-30 h-32 rounded object-cover"
        />
      ) : (
        // Placeholder frame for photo
        <div className="w-30 h-32 rounded border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-400">No Photo</span>
        </div>
      )}
    </div>
      
        <div>
          <div className="mb-2">
            <strong>Id: </strong> {teacherDetails.id}
          </div>
          <div className="mb-2">
            <strong>Name: </strong> {teacherDetails.name}
          </div>
          <div className="mb-2">
            <strong>Email: </strong> {teacherDetails.gmail}
          </div>
          <div className="mb-2">
            <strong>Course: </strong> {teacherDetails.subject}
          </div>
          <div className="mb-2">
            <strong>Account: </strong> {teacherDetails.account}
          </div>
         
          <button 
                    className={`mt-4 p-2 w-full text-white ${detailsRequested ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    onClick={requestUpdate}
                    disabled={detailsRequested}  // Disable button based on contract state (CHANGE HERE)
                >
                    {detailsRequested ? "Update Requested" : "Request Details Update"}
                </button>
          </div>
      </div> 

    );
}

export default TeacherProfile;

