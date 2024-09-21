let isBookingStarted = false; // Flag to track if booking process has started

function clickBookTickets() {
  // Find all buttons and filter those that contain 'book' in their text (case-insensitive)
  const bookButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('book')); // Change if the button text is different
  // If a "Book Tickets" button is found, click it
  if (bookButtons.length > 0) {
    bookButtons[0].click();
    console.log('Clicked Book Tickets button');
    return true;
  }
  console.log('Book Tickets button not found');
  return false;
}

function selectDate() {
  // Find all buttons and filter those that contain '6:00 PM' in their text
  const timeButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.includes('PM')); // Change if the button text is different 
  if (timeButtons.length > 1) { // Check if there's more than one 6:00 PM button detected
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
  // Find all buttons and filter those that contain 'continue' in their text
  const continueButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('continue')); // Change if the button text is different after selecting the Date
  // If a "Continue" button is found, click it
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

  // If the URL is on the events page but not in the booking step
  if (url.includes('/events') && !url.includes('/booking-step')) { // Change the URL pattern as per the platform
    if (clickBookTickets()) {
      // If "Book Tickets" button was clicked, stop refreshing
      chrome.runtime.sendMessage({ action: "stopRefreshing" });
    } else {
      // If "Book Tickets" button was not clicked, keep refreshing
      chrome.runtime.sendMessage({ action: "startRefreshing" });
    }
  } else if (url.includes('/booking-step')) {
    // If the URL is in the booking step
    if (!isBookingStarted) {
      isBookingStarted = true;
      console.log('Booking started');
    }
    // Select the date and time, then click continue after a delay
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