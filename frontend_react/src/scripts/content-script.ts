chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'CopyText') {
        // Extract the text content of the webpage
        const textContent = document.body.innerText;
        // Send the text content back to the background script  
        sendResponse({ textContent });
        
    }
});
export {};