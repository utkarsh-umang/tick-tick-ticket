let isRefreshing = false;
let refreshInterval = 5000;

function startRefreshing(tabId) {
  isRefreshing = true;
  refreshTab(tabId);
}

function stopRefreshing() {
  isRefreshing = false;
}

function refreshTab(tabId) {
  if (!isRefreshing) return;
  
  chrome.tabs.reload(tabId, {}, () => {
    setTimeout(() => refreshTab(tabId), refreshInterval);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRefreshing") {
    startRefreshing(sender.tab.id);
  } else if (request.action === "stopRefreshing") {
    stopRefreshing();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('https://in.bookmyshow.com/')) {
    chrome.tabs.sendMessage(tabId, { action: "runAutomation", url: tab.url });
  }
});