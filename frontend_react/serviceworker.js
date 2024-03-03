var activeTabId;
chrome.tabs.onActivated.addListener(function(activeInfo) {
    activeTabId = activeInfo.tabId;
    console.log('activeTabId', activeTabId);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
if (message.action === 'CopyText') {
    console.log('message was received in background.js', message);
    chrome.tabs.query({ active: true}, function(tabs) {
    console.log('tabs', tabs)
    if (tabs[0]) {
        console.log("seing message to content.js");
        chrome.tabs.sendMessage(activeTabId, { action: 'CopyText',currentWindow: true }, function(response) {
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
