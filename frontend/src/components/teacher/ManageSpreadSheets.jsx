import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../../context/BlockchainContext';
import { useStudentTeacher } from '../../context/StudentTeacherContext';
import { useNavigate } from 'react-router-dom';

const ManageSpreadsheets = () => {
  const { account } = useBlockchain();
  const { addSpreadSheet, getSpreadSheets } = useStudentTeacher();

  const [sheetLink, setSheetLink] = useState('');
  const [title, setTitle] = useState('');
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpreadsheets = async () => {
      try {
        const fetchedSpreadsheets = await getSpreadSheets(account);

        if (Array.isArray(fetchedSpreadsheets)) {
          console.log("Fetched Spreadsheets:", fetchedSpreadsheets);
          fetchedSpreadsheets.forEach((sheet) => {
            console.log("Title:", sheet.title);
            console.log("Link:", sheet.sheetlink);
          });
          setSpreadsheets(fetchedSpreadsheets);
        } else {
          console.error('Unexpected response format', fetchedSpreadsheets);
        }
      } catch (err) {
        console.error('Error fetching spreadsheets:', err);
        setError('Failed to load spreadsheets. Please try again later.');
      }
    };

    fetchSpreadsheets();
  }, [account, getSpreadSheets]);

  const handleAddSpreadsheet = async (e) => {
    e.preventDefault();

    if (!sheetLink || !title) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await addSpreadSheet(account, sheetLink, title);

      setSheetLink('');
      setTitle('');

      const updatedSpreadsheets = await getSpreadSheets(account);
      setSpreadsheets(updatedSpreadsheets);
    } catch (err) {
      console.error('Error adding spreadsheet:', err);
      alert('Failed to add spreadsheet. Please try again.');
    }
  };

  const handleSheetClick = (sheetlink) => {
    const encodedLink = encodeURIComponent(sheetlink);
    navigate(`goolespreadsheet/${encodedLink}`);
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Spreadsheets for Teacher {account}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAddSpreadsheet} className="mb-6">
        <input
          type="text"
          placeholder="Spreadsheet Link"
          value={sheetLink}
          onChange={(e) => setSheetLink(e.target.value)}
          required
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Spreadsheet Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border rounded p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Spreadsheet
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Spreadsheets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spreadsheets.length > 0 ? (
          spreadsheets.map((sheet, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h3 className="text-xl font-semibold">{sheet.title}</h3>
              <button
                onClick={() => handleSheetClick(sheet.sheetlink)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No spreadsheets found for this teacher.</p>
        )}
      </div>

    </div>
  );
};

export default ManageSpreadsheets;
