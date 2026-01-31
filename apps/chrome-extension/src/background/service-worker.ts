// Background service worker for Your Are Loud extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Your Are Loud extension installed');

  // Set default values
  chrome.storage.local.set({
    threshold: 0.7,
    warningCount: 0,
  });
});

// Listen for notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'WARNING_TRIGGERED') {
    // Increment warning count
    chrome.storage.local.get(['warningCount'], (result) => {
      const newCount = (result.warningCount || 0) + 1;
      chrome.storage.local.set({ warningCount: newCount });
    });
  }

  sendResponse({ success: true });
  return true;
});
