import React, { useState, useEffect } from 'react';
import { useStudentTeacher } from '../../context/StudentTeacherContext';
import { useParams } from 'react-router-dom';

const ViewStudentEvents = () => {
  const { studentAccount } = useParams(); // Get student account from URL parameters
  const {  getCertificates } = useStudentTeacher();
 
  
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const fetchedCertificates = await getCertificates(studentAccount);
      setCertificates(fetchedCertificates);
    };

    fetchCertificates();
  }, [studentAccount, getCertificates]);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Certificates for {studentAccount}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{cert.eventName}</h3>
              {/* Ensure eventDate is displayed correctly */}
              <p className="mt-2">Date: {new Date(cert.eventDate.toString() * 1000).toLocaleDateString()}</p>
              <p className="mt-2">File Hash: {cert.fileHash}</p>
              <p className="mt-2">Remark: {cert.eventRemark}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No events found for this student.</p>
        )}
      </div>
    </div>
  );
};

export default ViewStudentEvents;
