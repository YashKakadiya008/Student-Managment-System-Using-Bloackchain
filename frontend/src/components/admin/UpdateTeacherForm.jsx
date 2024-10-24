import React, { useState, useEffect } from 'react';
import Teacher from "../../contracts/Teacher.json";
import { useParams } from 'react-router-dom';
import web3 from '../../web3';

const UpdateTeacherForm = ({ teacherFactoryContract, account }) => {
  const { teacherAccount } = useParams();
  const [teacherContract, setTeacherContract] = useState(null);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [gmail, setGmail] = useState('');
  const [admin] = useState(account);

  useEffect(() => {
    const loadTeacherDetails = async () => {
      if (!teacherAccount || !web3.utils.isAddress(teacherAccount)) {
        console.error("Invalid or undefined teacher account.");
        return;
      }
      try {
        const teacherAddress = await teacherFactoryContract.methods.getTeacher(teacherAccount).call();
        const teacherContractInstance = new web3.eth.Contract(Teacher.abi, teacherAddress);
        setTeacherContract(teacherContractInstance);


        const teacherId = await teacherContractInstance.methods.id().call();
        const teacherName = await teacherContractInstance.methods.name().call();
        const teacherSubject = await teacherContractInstance.methods.subject().call();
        const teacherGmail = await teacherContractInstance.methods.gmail().call();


        setId(teacherId);
        setName(teacherName);
        setSubject(teacherSubject);
        setGmail(teacherGmail);

      } catch (error) {
        console.error("Error loading teacher details:", error);
      }
    };

    loadTeacherDetails();
  }, [account, teacherFactoryContract, teacherAccount]);

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    if (teacherContract) {
      try {
        await teacherContract.methods
          .updateDetails(id, name, subject, gmail)
          .send({ from: admin, gas: 5000000 });
        alert('Teacher details updated successfully!');
      } catch (error) {
        console.error("Failed to update teacher details:", error);
        alert('Failed to update teacher details. Please try again.');
      }
    }
  };
  return (
    <form onSubmit={handleUpdateTeacher} className="space-y-4">
      <h2 className="text-2xl font-bold">Update Teacher Details (ID: {id})</h2>
      <div>
        <label>Id:</label>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label>Subject:</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Teacher
      </button>
    </form>
  );
};

export default UpdateTeacherForm;
