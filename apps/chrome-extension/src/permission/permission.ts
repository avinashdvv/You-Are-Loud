import { MessageType } from '../constants/messages';

/**
 * Runs in a tab so Chrome shows the native microphone permission prompt.
 * Popup cannot show the prompt; this page can. After user allows, close tab.
 */
const statusEl = document.getElementById('status');
const hintEl = document.getElementById('hint');

async function requestMicrophone() {
  if (!statusEl) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    statusEl.textContent = 'Microphone access granted.';
    statusEl.classList.add('success');
    if (hintEl) hintEl.style.display = 'block';
    chrome.runtime.sendMessage({ type: MessageType.MIC_PERMISSION_GRANTED });
    window.close();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    statusEl.textContent = 'Access denied or dismissed. Close this tab and try again from the extension popup.';
    statusEl.classList.add('error');
  }
}

requestMicrophone();
