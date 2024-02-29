// Popup.tsx

import React from 'react';
import './Popup.css';

const Popup: React.FC = () => {

  // On Extract Courses click
  const handleExtractCourses = () => {
    // Add your functionality here
    console.log('clicked Extract Courses button');
  
    chrome.runtime.sendMessage({ action: 'CopyText' }, (response) => {
      console.log('response from background script:', response);
      
      chrome.runtime.sendMessage({ action: 'ExtractCourses', data:{response} }, (courses) => {
        console.log('Response received in popup:', courses);
       
        if (courses) {
            
        }

    });
    });
  };


  return (
    <div className="popup-container noselect" >
      <h1 className="title">UWaterloo Exam Schedule Exporter</h1>
      <div className="step">
        <h2 className="step-header">Step 1: Extract Courses</h2>
        <p className='step-description'>Navigate to the "Class Sechedule" tile in Quest and click the button below.</p>
        <button className="extract-button" onClick={handleExtractCourses}>Extract Courses</button>
      </div>
      <div className="step">
        <h2 className="step-header">Step 2: Add/Drop Courses</h2>
        <p className='step-description'>Content for Step 2 goes here...</p>
      </div>
      <div className="step">
        <h2 className="step-header">Step 3: Export Schedule</h2>
        <p className='step-description'>Content for Step 3 goes here...</p>
      </div>
    </div>
)};

export default Popup;
