const refreshInterval = 1000; //1 second

function refreshTab(tabId) {
  chrome.tabs.reload(tabId);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('https://in.bookmyshow.com/')) {
    setTimeout(() => refreshTab(tabId), refreshInterval);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openNewTab") {
    chrome.tabs.create({ url: request.url });
  }
});