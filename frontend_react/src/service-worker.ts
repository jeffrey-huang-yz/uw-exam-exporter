chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ExtractCourses') {
      //Schedule text from the message
      const responseData = message.data; 
      // HTTP request to flask backend
      fetch('http://your-flask-backend-url/extract-course-codes', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(responseData),
      })
      .then(response => response.json())
      .then(courses => {
          console.log('Response received from Flask backend:', courses);
          // Send the courses data back popup.ts
          sendResponse(courses);
      })
      .catch(error => {
          console.error('Error:', error);
          
      });

     
  }
});
export {}