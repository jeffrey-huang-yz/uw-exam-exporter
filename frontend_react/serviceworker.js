chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'CopyText') {
      console.log('message was received in background.js', message);
      chrome.tabs.query({ active: true,currentWindow: true  }, function(tabs) {
          console.log('tabs', tabs)
          if (tabs[0]) {
              console.log("seing message to content.js");
              chrome.tabs.sendMessage(tabs[0].id, { action: 'CopyText',currentWindow: true }, function(response) {
                  console.log("received response from content.js", response);
                  sendResponse(response); // Sending content script response back
              });
          } else {
              console.error('No active tab found');
              sendResponse({ error: 'No active tab found' });
          }
      });
      return true; // This indicates that sendResponse will be called asynchronously
  }
});
