let tabsRefreshing = {};
let refreshInterval = 5000; // Interval for refreshing the site in milliseconds

function startRefreshing(tabId) {
  if (!tabsRefreshing[tabId]) {
    tabsRefreshing[tabId] = true;
    refreshTab(tabId);
  }
}

function stopRefreshing(tabId) {
  if (tabsRefreshing[tabId]) {
    tabsRefreshing[tabId] = false;
  }
}

function refreshTab(tabId) {
  if (!tabsRefreshing[tabId]) return;

  chrome.tabs.reload(tabId, {}, () => {
    setTimeout(() => refreshTab(tabId), refreshInterval);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRefreshing") {
    startRefreshing(sender.tab.id);
  } else if (request.action === "stopRefreshing") {
    stopRefreshing(sender.tab.id);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab has finished loading and the URL matches the specified base URL
  if (changeInfo.status === 'complete' && tab.url.includes('https://in.bookmyshow.com/')) {
    chrome.tabs.sendMessage(tabId, { action: "runAutomation", url: tab.url });
  }
});