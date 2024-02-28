// contentScript.ts

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'copyText') {
        // Extract the text content of the webpage
        const textContent = document.body.innerText;
        // Send the text content back to the background script  
        chrome.runtime.sendMessage({ action: 'copiedText', textContent });
    }
});
export {};