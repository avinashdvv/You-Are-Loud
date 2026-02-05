// Background service worker for Your Are Loud extension

let currentVolume = 0;
let isMonitoring = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Your Are Loud extension installed');

  // Set default values
  chrome.storage.local.set({
    threshold: 0.7,
    warningCount: 0,
    isMonitoring: false,
  });
});

// Listen for notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);
});

// Handle messages from popup and offscreen document
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'START_MONITORING') {
    handleStartMonitoring().then(sendResponse);
    return true;
  } else if (request.type === 'STOP_MONITORING') {
    handleStopMonitoring().then(sendResponse);
    return true;
  } else if (request.type === 'GET_STATUS') {
    sendResponse({ isMonitoring, currentVolume });
    return true;
  } else if (request.type === 'SET_THRESHOLD') {
    handleSetThreshold(request.threshold).then(sendResponse);
    return true;
  } else if (request.type === 'VOLUME_UPDATE') {
    // Update from offscreen document
    currentVolume = request.volume;
    // Broadcast to any listening popup
    broadcastVolumeUpdate(request.volume);
    sendResponse({ success: true });
  } else if (request.type === 'WARNING_TRIGGERED') {
    // Show notification and increment warning count
    showWarningNotification();
    sendResponse({ success: true });
  }

  return true;
});

// Create and manage offscreen document
async function setupOffscreenDocument() {
  try {
    // Check if offscreen API is available
    if (!chrome.offscreen) {
      console.error('Offscreen API not available');
      throw new Error('Offscreen API not supported in this Chrome version. Please update Chrome to version 109+');
    }

    // Try to close any existing offscreen document first
    try {
      await chrome.offscreen.closeDocument();
      console.log('Closed existing offscreen document');
    } catch (e) {
      // No existing document, that's fine
    }

    console.log('Creating offscreen document...');
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'] as any,
      justification: 'Audio monitoring for voice level detection'
    });
    console.log('Offscreen document created successfully');
  } catch (error) {
    console.error('Failed to setup offscreen document:', error);
    throw error;
  }
}

async function handleStartMonitoring() {
  try {
    console.log('Starting monitoring...');
    
    // Ensure offscreen document exists
    await setupOffscreenDocument();
    
    // Wait a bit for offscreen document to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Send start command to offscreen document
    const response = await chrome.runtime.sendMessage({ type: 'START_MONITORING' });
    
    if (response && response.success) {
      isMonitoring = true;
      chrome.storage.local.set({ isMonitoring: true });
      console.log('Monitoring started successfully');
      return { success: true, isMonitoring: true };
    } else {
      throw new Error(response?.error || 'Failed to start monitoring');
    }
  } catch (error) {
    console.error('Error starting monitoring:', error);
    return { success: false, error: (error as Error).message };
  }
}

async function handleStopMonitoring() {
  try {
    console.log('Stopping monitoring...');
    
    // Send stop command to offscreen document
    await chrome.runtime.sendMessage({ type: 'STOP_MONITORING' });
    
    isMonitoring = false;
    currentVolume = 0;
    chrome.storage.local.set({ isMonitoring: false });
    console.log('Monitoring stopped successfully');
    
    return { success: true, isMonitoring: false };
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    return { success: false, error: (error as Error).message };
  }
}

async function handleSetThreshold(threshold: number) {
  try {
    // Save threshold
    chrome.storage.local.set({ threshold });
    
    // Send to offscreen document if monitoring
    if (isMonitoring) {
      await chrome.runtime.sendMessage({ 
        type: 'SET_THRESHOLD', 
        threshold 
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error setting threshold:', error);
    return { success: false, error: (error as Error).message };
  }
}

function showWarningNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: "🔊 You're Too Loud!",
    message: 'You have been speaking too loud for 1 minute. Please lower your voice.',
    priority: 2,
    requireInteraction: true, // Notification stays until user dismisses it
  });

  // Increment warning count
  chrome.storage.local.get(['warningCount'], (result) => {
    const newCount = (result.warningCount || 0) + 1;
    chrome.storage.local.set({ warningCount: newCount });
  });
}

function broadcastVolumeUpdate(volume: number) {
  // This will be caught by popup if it's open
  chrome.runtime.sendMessage({ 
    type: 'VOLUME_BROADCAST', 
    volume 
  }).catch(() => {
    // Popup might be closed, that's okay
  });
}

// Restore monitoring state on startup
chrome.storage.local.get(['isMonitoring', 'threshold'], async (result) => {
  if (result.isMonitoring) {
    console.log('Restoring monitoring state...');
    if (result.threshold) {
      await handleSetThreshold(result.threshold);
    }
    await handleStartMonitoring();
  }
});
