chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'CopyText') {
      console.log("message was received in content.js", message);
    
      const textContent = document.body.innerText;
      console.log(textContent);
      sendResponse({ textContent: textContent }); // Sending textContent back
  }
});
