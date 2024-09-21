let isBookingStarted = false;

function clickBookTickets() {
  const bookButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('book')); // Change if the button text is different
  if (bookButtons.length > 0) {
    bookButtons[0].click();
    console.log('Clicked Book Tickets button');
    return true;
  }
  console.log('Book Tickets button not found');
  return false;
}

// If there are additional steps, can add similar type of functions
function selectDate() {
  const timeButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.includes('PM')); // Change if the button text is different [In our case the button is 6:00 PM]
  if (timeButtons.length > 1) { // Check if there's more than one 6:00 PM button detected
    timeButtons[1].click(); // Click on the second 6:00 PM button [Specific to our case, we have two 6:00 PM buttons for two different dates]
    console.log('Selected second 6:00 PM (For 19th January)');
    return true;
  } else if (timeButtons.length > 0) {
    // Fall back to clicking the first one, just in case [Can use just this else body if there's only one button for your case]
    timeButtons[0].click();
    console.log('Only one 6:00 PM found, clicking it');
    return true;
  }
  console.log('No 6:00 PM buttons found');
  return false;
}

// Continue button to proceed after every form filling step [In this case date and time selection]
function clickContinue() {
  const continueButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('continue')); // Change if the button text is different [Could be Proceed or anything]
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

  // To decide which function of automation to trgigger based on the URL
  // For this case we are triggering the book tickets button if the URL includes /events or /specials
  if ((url.includes('/events') || url.includes('/specials')) && !url.includes('/booking-step')) { // Change the URL pattern as per the platform
    if (clickBookTickets()) {
      // Stop refreshing once the "Book Tickets" button is clicked
      chrome.runtime.sendMessage({ action: "stopRefreshing" });
    } else {
      // If "Book Tickets" button was not clicked, keep refreshing [This will ensure the page is refreshing continously until the button is enabled and thus clicked]
      chrome.runtime.sendMessage({ action: "startRefreshing" });
    }
  } else if (url.includes('/booking-step')) { // Change the URL pattern as per the platform [For booking steps where we need to fill formData]
    if (!isBookingStarted) {
      isBookingStarted = true;
      console.log('Booking started');
    }
    // Click continue after filling the booking step form
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