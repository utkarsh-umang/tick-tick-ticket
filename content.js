const minInterval = 1000; // 1 second
const maxInterval = 2000; // 2 seconds

let currentState = 'INITIAL';
let lastRunTimestamp = 0;

function getRandomInterval() {
  return Math.floor(Math.random() * (maxInterval - minInterval + 1) + minInterval);
}

function clickBookTickets() {
  const bookButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('book'));
  if (bookButtons.length > 0) {
    bookButtons[0].click();
    console.log('Clicked Book Tickets button');
    currentState = 'WAITING_FOR_DATE_PAGE';
  } else {
    console.log('Book Tickets button not found');
  }
}

function selectDate() {
  const dateTicketButton = Array.from(document.querySelectorAll('li')).find(li => 
    li.textContent.trim() === 'Sunday Tickets');
  if (dateTicketButton) {
    dateTicketButton.click();
    console.log('Date selected');
    currentState = 'WAITING_FOR_CONTINUE';
  } else {
    console.log('Date selector not found');
  }
}

function clickContinue() {
  const continueButtons = Array.from(document.querySelectorAll('button')).filter(button => 
    button.textContent.toLowerCase().includes('continue'));
  if (continueButtons.length > 0 && !continueButtons[0].disabled) {
    continueButtons[0].click();
    console.log('Clicked Continue button');
    currentState = 'COMPLETED';
  } else {
    console.log('Continue button not found or disabled');
  }
}

function runAutomation(timestamp) {
  if (timestamp - lastRunTimestamp > getRandomInterval()) {
    console.log('Current state:', currentState);
    switch (currentState) {
      case 'INITIAL':
        if (window.location.href.includes('/events') && !window.location.href.includes('/booking-step')) {
          clickBookTickets();
        }
        break;
      case 'WAITING_FOR_DATE_PAGE':
        if (window.location.href.includes('/booking-step/datetime') || window.location.href.includes('/booking-step')) {
          selectDate();
        }
        break;
      case 'WAITING_FOR_CONTINUE':
        clickContinue();
        break;
      case 'COMPLETED':
        console.log('Booking process completed');
        return; // Stop the automation
    }
    lastRunTimestamp = timestamp;
  }
  
  requestAnimationFrame(runAutomation);
}

console.log('Starting automation');
requestAnimationFrame(runAutomation);