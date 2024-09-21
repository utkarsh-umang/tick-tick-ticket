let isBookingStarted = false;

function clickBookTickets() {
  const bookButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('book'));
  if (bookButtons.length > 0) {
    bookButtons[0].click();
    console.log('Clicked Book Tickets button');
    return true;
  }
  console.log('Book Tickets button not found');
  return false;
}

function selectDate() {
  const timeButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.includes('6:00 PM')); // Finds all buttons with '6:00 PM'

  if (timeButtons.length > 1) { // Ensure there's more than one matching button
    timeButtons[1].click(); // Click on the second 6:00 PM button for 19th January
    console.log('Selected second 6:00 PM (For 19th January)');
    return true;
  } else if (timeButtons.length > 0) {
    // Fall back to clicking the first one, just in case
    timeButtons[0].click();
    console.log('Only one 6:00 PM found, clicking it');
    return true;
  }
  console.log('No 6:00 PM buttons found');
  return false;
}

function clickContinue() {
  const continueButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('continue'));
  if (continueButtons.length > 0) {
    continueButtons[0].click();
    console.log('Clicked Continue button');
    return true;
  }
  console.log('Continue button not found or disabled');
  return false;
}

function runAutomation(url) {
  console.log('Running automation on URL:', url);

  if (!isBookingStarted && url.includes('/events') && !url.includes('/booking-step')) {
    if (clickBookTickets()) {
      chrome.runtime.sendMessage({ action: "startRefreshing" });
    }
  } else if (url.includes('/booking-step')) {
    if (!isBookingStarted) {
      isBookingStarted = true;
      chrome.runtime.sendMessage({ action: "stopRefreshing" });
      console.log('Booking started, stopped refreshing');
    }
    if (selectDate()) {
      setTimeout(clickContinue, 1000);
    }
  } else {
    console.log('Unknown page state');
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runAutomation") {
    runAutomation(request.url);
  }
});

runAutomation(window.location.href);