import { MessageType } from '../constants/messages';
import { StorageKey } from '../constants/storage';

let currentVolume = 0;
let isMonitoring = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Your Are Loud extension installed');

  chrome.storage.local.set({
    [StorageKey.THRESHOLD]: 0.7,
    [StorageKey.WARNING_COUNT]: 0,
    [StorageKey.IS_MONITORING]: false,
  });
});

chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MessageType.START_MONITORING) {
    handleStartMonitoring().then(sendResponse);
    return true;
  } else if (request.type === MessageType.STOP_MONITORING) {
    handleStopMonitoring().then(sendResponse);
    return true;
  } else if (request.type === MessageType.GET_STATUS) {
    sendResponse({ isMonitoring, currentVolume });
    return true;
  } else if (request.type === MessageType.SET_THRESHOLD) {
    handleSetThreshold(request.threshold).then(sendResponse);
    return true;
  } else if (request.type === MessageType.VOLUME_UPDATE) {
    currentVolume = request.volume;
    broadcastVolumeUpdate(request.volume);
    sendResponse({ success: true });
  } else if (request.type === MessageType.WARNING_TRIGGERED) {
    showWarningNotification();
    sendResponse({ success: true });
  }

  return true;
});

async function setupOffscreenDocument() {
  try {
    if (!chrome.offscreen) {
      console.error('Offscreen API not available');
      throw new Error('Offscreen API not supported in this Chrome version. Please update Chrome to version 109+');
    }

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
      justification: 'Audio monitoring for voice level detection',
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
    await setupOffscreenDocument();
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await chrome.runtime.sendMessage({ type: MessageType.START_MONITORING });

    if (response && response.success) {
      isMonitoring = true;
      chrome.storage.local.set({ [StorageKey.IS_MONITORING]: true });
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
    await chrome.runtime.sendMessage({ type: MessageType.STOP_MONITORING });

    isMonitoring = false;
    currentVolume = 0;
    chrome.storage.local.set({ [StorageKey.IS_MONITORING]: false });
    console.log('Monitoring stopped successfully');
    return { success: true, isMonitoring: false };
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    return { success: false, error: (error as Error).message };
  }
}

async function handleSetThreshold(threshold: number) {
  try {
    chrome.storage.local.set({ [StorageKey.THRESHOLD]: threshold });

    if (isMonitoring) {
      await chrome.runtime.sendMessage({ type: MessageType.SET_THRESHOLD, threshold });
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
    requireInteraction: true,
  });

  chrome.storage.local.get([StorageKey.WARNING_COUNT], (result) => {
    const newCount = (result[StorageKey.WARNING_COUNT] || 0) + 1;
    chrome.storage.local.set({ [StorageKey.WARNING_COUNT]: newCount });
  });
}

function broadcastVolumeUpdate(volume: number) {
  chrome.runtime.sendMessage({ type: MessageType.VOLUME_BROADCAST, volume }).catch(() => {
    // Popup might be closed, that's okay
  });
}

chrome.storage.local.get([StorageKey.IS_MONITORING, StorageKey.THRESHOLD], async (result) => {
  if (result[StorageKey.IS_MONITORING]) {
    console.log('Restoring monitoring state...');
    if (result[StorageKey.THRESHOLD]) {
      await handleSetThreshold(result[StorageKey.THRESHOLD]);
    }
    await handleStartMonitoring();
  }
});
