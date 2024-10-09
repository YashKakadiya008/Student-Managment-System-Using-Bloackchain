import React from "react";
import { useParams } from 'react-router-dom';

const GoogleSpreadSheet = () => {
    const { sheetlink } = useParams();
  const decodedLink = decodeURIComponent(sheetlink);
    
  return (
    <div style={{ width: "100%", height: "500px", overflow: "hidden" }}>
      <iframe
        src={decodedLink}
        width="100%"
        height="100%"
     frameBorder="0"
       title="Google Spreadsheet"
        style={{ border: 0 }}
      ></iframe>
    </div>
  );
};

export default GoogleSpreadSheet;

// "https://docs.google.com/spreadsheets/d/1vB3zJjO1CJwP7cS_nbqfXtW_rjravi9t9bHh-MFdyEE/edit?gid=1923098947#gid=1923098947";