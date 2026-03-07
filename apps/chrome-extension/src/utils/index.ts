export const isMicrophonePermissionGranted = async (): Promise<boolean> => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => track.stop());
  return true;
};

export const openPermissionTab = async (): Promise<void> => {
  try {
    await chrome.tabs.create({ url: chrome.runtime.getURL('permission.html') });
  } catch (error) {
    console.error('Failed to open permission tab:', error);
    throw error;
  }
};

export const isMicrophonePermissionDenied = (msg: string): boolean => {
  return /permission|notallowed|denied|dismissed|blocked/i.test(msg);
};
