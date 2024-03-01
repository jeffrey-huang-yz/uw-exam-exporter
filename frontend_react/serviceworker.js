chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'CopyText') {
        console.log('Message received in content script:', message);
        // Extract the text content of the webpage
        const textContent = document.body.innerText;
        // Send the text content back to the background script  
        sendResponse({ textContent });
        return true; 
    }
});
export {};