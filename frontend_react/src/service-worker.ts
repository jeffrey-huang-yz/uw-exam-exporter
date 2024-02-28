// src/background.ts

// Example event listener for extension installation or updates
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed or updated!', details);
  });
  
  // Example message listener for messages from the popup or content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'popupButtonClicked') {
      console.log('Popup button clicked!');
      // Example of sending a message to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'changeBackgroundColor' });
        }
      });
    }
  });
  

  export {};