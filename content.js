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
  const dateTicketButton = Array.from(document.querySelectorAll('li')).find(li => 
    li.textContent.trim() === 'Sunday Tickets');
  if (dateTicketButton) {
    dateTicketButton.click();
    console.log('Date selected');
    return true;
  }
  console.log('Date selector not found');
  return false;
}

function clickContinue() {
  const continueButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('continue'));
  if (continueButtons.length > 0 && !continueButtons[0].disabled) {
    continueButtons[0].click();
    console.log('Clicked Continue button');
    return true;
  }
  console.log('Continue button not found or disabled');
  return false;
}

function runAutomation() {
  console.log('Running automation');
  
  if (window.location.href.includes('/events') && !window.location.href.includes('/booking-step')) {
    clickBookTickets();
  } else if (window.location.href.includes('/booking-step/datetime') || window.location.href.includes('/booking-step')) {
    if (selectDate()) {
      // If date selection was successful, try to click continue
      setTimeout(clickContinue, 1000); // Wait a bit for any page updates
    }
  } else {
    console.log('Unknown page state');
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runAutomation") {
    runAutomation();
  }
});

// Run automation once when the script loads
runAutomation();