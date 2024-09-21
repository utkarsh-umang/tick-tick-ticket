chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('https://in.bookmyshow.com/')) {
    chrome.tabs.sendMessage(tabId, { action: "runAutomation" });
  }
});