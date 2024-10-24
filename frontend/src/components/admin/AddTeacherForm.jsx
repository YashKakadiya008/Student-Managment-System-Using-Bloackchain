import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageUploadForm from '../ImageUploadForm';
import { useIpfs } from '../../context/IpfsContext';

function AddTeacherForm({ teacherFactoryContract, account }) {
  const [teacherId, setTeacherId] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherAccount, setTeacherAccount] = useState("");
  const { photoHash, setPhotoHash } = useIpfs();

  const addTeacher = async (photo, id, name, subject, email, accountAddress) => {
    try {
      await teacherFactoryContract.methods
        .createTeacher(photo, id, name, subject, email, accountAddress)
        .send({ from: account, gas: 5000000 });
      console.log("Teacher added successfully");

      setPhotoHash("");
      setTeacherId("");
      setTeacherName("");
      setTeacherSubject("");
      setTeacherEmail("");
      setTeacherAccount("");
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTeacher(photoHash, teacherId, teacherName, teacherSubject, teacherEmail, teacherAccount);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Add Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Teacher Subject"
          value={teacherSubject}
          onChange={(e) => setTeacherSubject(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Teacher Email"
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Teacher Account"
          value={teacherAccount}
          onChange={(e) => setTeacherAccount(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <ImageUploadForm />
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Add Teacher
        </button>
      </form>
    </div>
  );
}

AddTeacherForm.propTypes = {
  teacherFactoryContract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
};

export default AddTeacherForm;
