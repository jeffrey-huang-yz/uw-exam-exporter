chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'CopyText') {
      console.log('message was received in background.js', message);
      chrome.tabs.query({ active: true }, function(tabs) {
          console.log('tabs', tabs)
          if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'CopyText' }, function(response) {
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
