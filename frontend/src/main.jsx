import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { BlockchainProvider } from './context/BlockchainContext.jsx';
import { StudentTeacherProvider } from './context/StudentTeacherContext.jsx';
import { IpfsProvider } from './context/IpfsContext.jsx';
import { ResultProvider } from './context/ResultContext.jsx'; // Use ResultProvider, not ResultContext

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <BlockchainProvider>
      <StudentTeacherProvider>
        <IpfsProvider>
          <ResultProvider> 
            <App />
          </ResultProvider>
        </IpfsProvider>
      </StudentTeacherProvider>
    </BlockchainProvider>
  </BrowserRouter>
);
