// Content script to change tab background color
let overlayElement: HTMLDivElement | null = null;
let timeoutId: NodeJS.Timeout | null = null;

// Create overlay element
function createOverlay() {
  if (overlayElement) return overlayElement;

  overlayElement = document.createElement('div');
  overlayElement.id = 'your-are-loud-overlay';
  overlayElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(244, 67, 54, 0.3);
    z-index: 999999;
    pointer-events: none;
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  
  document.body.appendChild(overlayElement);
  return overlayElement;
}

// Show red overlay
function showRedOverlay() {
  const overlay = createOverlay();
  overlay.style.opacity = '1';
  
  // Auto-hide after 3 seconds
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = setTimeout(() => {
    hideOverlay();
  }, 3000);
}

// Hide overlay
function hideOverlay() {
  if (overlayElement) {
    overlayElement.style.opacity = '0';
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SHOW_RED_OVERLAY') {
    showRedOverlay();
    sendResponse({ success: true });
  } else if (request.type === 'HIDE_OVERLAY') {
    hideOverlay();
    sendResponse({ success: true });
  }
  return true;
});

console.log('Your Are Loud content script loaded');
