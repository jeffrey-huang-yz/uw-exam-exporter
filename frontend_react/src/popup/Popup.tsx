// Popup.tsx

import React from 'react';
import './Popup.css';

const Popup: React.FC = () => {
  return (
    <div className="popup-container">
      <h1 className="title">UWaterloo Exam Schedule Exporter</h1>
      <div className="step">
        <h2 className="step-header">Step 1: Extract Courses</h2>
        <p>Content for Step 1 goes here...</p>
      </div>
      <div className="step">
        <h2 className="step-header">Step 2: Add/Drop Courses</h2>
        <p>Content for Step 2 goes here...</p>
      </div>
      <div className="step">
        <h2 className="step-header">Step 3: Export Schedule</h2>
        <p>Content for Step 3 goes here...</p>
      </div>
    </div>
)};

export default Popup;
