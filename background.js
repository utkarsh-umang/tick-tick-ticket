// Object to keep track of which tabs are being refreshed
let tabsRefreshing = {};
// Interval for refreshing the site in milliseconds
let refreshInterval = 5000; 

// Function to start refreshing a tab
function startRefreshing(tabId) {
  if (!tabsRefreshing[tabId]) {
    tabsRefreshing[tabId] = true;
    refreshTab(tabId);
  }
}

// Function to stop refreshing a tab
function stopRefreshing(tabId) {
  if (tabsRefreshing[tabId]) {
    tabsRefreshing[tabId] = false;
  }
}

// Function to refresh a tab
function refreshTab(tabId) {
  if (!tabsRefreshing[tabId]) return;

  // Reload the tab
  chrome.tabs.reload(tabId, {}, () => {
    // Schedule the next refresh
    setTimeout(() => refreshTab(tabId), refreshInterval);
  });
}

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRefreshing") {
    startRefreshing(sender.tab.id);
  } else if (request.action === "stopRefreshing") {
    stopRefreshing(sender.tab.id);
  }
});

// Listener for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab has finished loading and the URL matches the specified pattern
  if (changeInfo.status === 'complete' && tab.url.includes('https://in.bookmyshow.com/')) {
    // Send a message to the content script to run automation
    chrome.tabs.sendMessage(tabId, { action: "runAutomation", url: tab.url });
  }
});