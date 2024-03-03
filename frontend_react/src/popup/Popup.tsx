
import React, { useState } from 'react';
import './Popup.css';

interface Course {
  course_code: string;
  course_section: string;
  day_of_week: string;
  month: string;
  day: string;
  year: string;
  start_time: string;
  end_time: string;
  location: string;
}


const Popup: React.FC = () => {
  const [copiedText, setCopiedText] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const testValues = `ECON 101 - Intro Microeconomics
  Status    Units    Grading    Deadlines
  Enrolled
  0.50
  Numeric Grading Basis
  Academic Calendar Deadlines
  Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
  3217
  002
  LEC
  MW 2:30PM - 3:50PM
  M3 1006
  Alain-Desire Nimubona
  01/08/2024 - 04/08/2024
  ENGL 119 - Communications (Math/Comp Sci)
  Status    Units    Grading    Deadlines
  Enrolled
  0.50
  Numeric Grading Basis
  Academic Calendar Deadlines
  Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
  8626
  004
  LEC
  TTh 2:30PM - 3:50PM
  EV3 3406
  Megan Selinger
  01/08/2024 - 04/08/2024
  MATH 136 - Linear Algebra 1 (Honours)
  Status    Units    Grading    Deadlines
  Enrolled
  0.50
  Numeric Grading Basis
  Academic Calendar Deadlines
  Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
  5941
  005
  LEC
  MWF 11:30AM - 12:20PM
  MC 4021
  Zhenchao Ge
  01/08/2024 - 04/08/2024
  6091
  201
  TST
  M 7:00PM - 8:50PM
  TBA
  To be Announced
  02/12/2024 - 02/12/2024
  6386
  102
  TUT
  M 4:30PM - 5:20PM
  STC 1012
  To be Announced
  01/08/2024 - 04/08/2024
  MATH 138 - Calculus 2 (Honours)
  Status    Units    Grading    Deadlines
  Enrolled
  0.50
  Numeric Grading Basis
  Academic Calendar Deadlines
  Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
  5949
  005
  LEC
  MWF 8:30AM - 9:20AM
  RCH 103
  Avneet Kaur
  01/08/2024 - 04/08/2024
  6092
  201
  TST
  M 7:00PM - 8:50PM
  TBA
  To be Announced
  02/26/2024 - 02/26/2024
  6337
  104
  TUT
  W 5:30PM - 6:20PM
  DC 1350
  To be Announced
  01/08/2024 - 04/08/2024
  CS 136 - Elem Algo Dsgn & Data Abstrac
Status    Units    Grading    Deadlines
Enrolled
0.50
Numeric Grading Basis
Academic Calendar Deadlines
Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
6056
201
TST
M 7:00PM - 8:50PM
TBA
Dalibor Dvorski
03/04/2024 - 03/04/2024
6075
003
LEC
TTh 1:00PM - 2:20PM
MC 2034
Cameron Morland
01/08/2024 - 04/08/2024
CS 136L - Tools & Tech for Software Dev
Status    Units    Grading    Deadlines
Enrolled
0.25
Credit / Non-Credit Basis
Academic Calendar Deadlines
Class Nbr    Section    Component    Days & Times    Room    Instructor    Start/End Date
6613
005
LAB
T 10:30AM - 12:20PM
MC 4060
Dalibor Dvorski,
Qianqiu Zhang
01/08/2024 - 04/08/2024`;
  // On Extract Courses click
  const handleExtractCourses = () => {
    // Add your functionality here
    console.log('clicked Extract Courses button');
  
    chrome.runtime.sendMessage({ action: 'CopyText' }, (response) => {
      console.log('response from background script:', response);
      setCopiedText('');
    });

    // Get the courses from the copied text
    fetch('http://localhost:5000/extract-course-codes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: testValues })
    })
    .then(response => {
      if (response.ok) {
          return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data); // Handle the response data here
        setCourses(data.matched_courses); // Set the courses state with the fetched data
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
  };

  const handleRemoveCourse = (indexToRemove: number) => {
    setCourses(prevCourses => prevCourses.filter((_, index) => index !== indexToRemove));
  };
  
  const handleGenerateICSAndDownload = () => {
    const icsContent = generateICSFile();
    const element = document.createElement('a');
    const file = new Blob([icsContent], { type: 'text/calendar' });
    element.href = URL.createObjectURL(file);
    element.download = 'examschedule.ics';
    document.body.appendChild(element);
    element.click();
  };
  
  const generateICSFile = () => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
  
    courses.forEach((course, index) => {
      const { course_code, course_section, day_of_week, month, day, year, start_time, end_time, location } = course;

      // Parse the start time and end time strings into Date objects
      const parseTime = (timeStr: string, date: Date) => {
        let [hourMinute, meridiem] = timeStr.match(/(.+)([AP]M)/)?.slice(1) || [];
        let [hour, minute] = hourMinute.split(':').map(Number);
        if (meridiem === 'PM' && hour < 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;
        date.setHours(hour, minute);
      };

      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      parseTime(start_time, startDate);
      parseTime(end_time, endDate);
  
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}Z/, 'Z');
      };
  
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:${index}@example.com\n`;
      icsContent += `SUMMARY:${course_code}\n`;
      icsContent += `DESCRIPTION:Course Section: ${course_section}\\nLocation: ${location}\n`;
      icsContent += `DTSTART:${formatDate(startDate)}\n`;
      icsContent += `DTEND:${formatDate(endDate)}\n`;
      icsContent += `END:VEVENT\n`;
    });
  
    icsContent += 'END:VCALENDAR';
  
    return icsContent;
};
  

  return (
    <div className="popup-container noselect" >
      <h1 className="title">UWaterloo Exam Schedule Exporter</h1>
      <div className="step">
        <h2 className="step-header">Step 1: Extract Courses</h2>
        <p className='step-description'>Navigate to the "Class Sechedule" tile in Quest and click the button below. Exam data is currently for the Winter 2024 term.</p>
        <button className="extract-button" onClick={handleExtractCourses}>Extract Courses</button>
      </div>
      <div className="step">
        <h2 className="step-header-courses">Step 2: Add/Drop Courses</h2>
        <p className='step-description-courses'>Drop any sections/courses that are irrelevant.</p>
        <div className='course-container'>
        {courses.map((course, index) => (
            <div key={index} className="course-card">
              <h3 className='course-code'>{course.course_code}</h3>
              <p>Course Section: {course.course_section || 'Check alternative course documents to find information'}</p>
              <p>Date: {course.year ? `${course.month || ''} ${course.day || ''}, ${course.year}` : 'Check alternative course documents to find information'}</p>
              <p>Time: {course.start_time ? `${course.start_time} - ${course.end_time}` : 'Check alternative course documents to find information'}</p>
              <p>Location: {course.location || 'Check alternative course documents to find information'}</p>
              <button className="remove-button" onClick={() => handleRemoveCourse(index)}>Remove Exam</button>
            </div>
          ))}
        </div>
      </div>
      <div className="step">
        <h2 className="step-header">Step 3: Export Schedule</h2>
        <p className='step-description'>Important exams into your calendar of choice via a .ics file.</p>
        <button className="generate-ics-button" onClick={handleGenerateICSAndDownload}>Generate .ics File and Download</button>
      </div>
    </div>
  )};

export default Popup;
