import React, { useState, useEffect } from 'react';
import './Popup.css';

export default function Popup() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threshold, setThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    // Load saved settings and status
    chrome.storage.local.get(['threshold', 'warningCount', 'isMonitoring'], (result) => {
      if (result.threshold !== undefined) {
        setThreshold(result.threshold);
      }
      if (result.warningCount !== undefined) {
        setWarningCount(result.warningCount);
      }
      if (result.isMonitoring !== undefined) {
        setIsMonitoring(result.isMonitoring);
      }
    });

    // Get current status from background
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      if (response) {
        setIsMonitoring(response.isMonitoring);
        setCurrentVolume(response.currentVolume || 0);
      }
    });

    // Listen for volume updates from background
    const messageListener = (request: any) => {
      if (request.type === 'VOLUME_BROADCAST') {
        setCurrentVolume(request.volume);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);

    // Listen for storage changes (warning count updates)
    const storageListener = (changes: any) => {
      if (changes.warningCount) {
        setWarningCount(changes.warningCount.newValue);
      }
    };
    chrome.storage.onChanged.addListener(storageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, []);

  const startMonitoring = async () => {
    try {
      console.log('Requesting to start monitoring...');
      const response = await chrome.runtime.sendMessage({ type: 'START_MONITORING' });
      console.log('Response from background:', response);
      
      if (response && response.success) {
        setIsMonitoring(true);
        console.log('Monitoring started successfully');
      } else {
        const errorMsg = response?.error || 'Unknown error';
        console.error('Failed to start monitoring:', errorMsg);
        alert('Failed to start monitoring:\n\n' + errorMsg + '\n\nCheck the extension service worker console for details.');
      }
    } catch (error) {
      console.error('Error starting monitoring:', error);
      alert('Error: ' + (error as Error).message + '\n\nMake sure:\n1. Chrome is version 109+\n2. Microphone permission is granted\n3. Check service worker console for errors');
    }
  };

  const stopMonitoring = async () => {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'STOP_MONITORING' });
      if (response.success) {
        setIsMonitoring(false);
        setCurrentVolume(0);
      }
    } catch (error) {
      console.error('Failed to stop monitoring:', error);
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = parseFloat(e.target.value);
    setThreshold(newThreshold);
    chrome.runtime.sendMessage({ 
      type: 'SET_THRESHOLD', 
      threshold: newThreshold 
    });
  };

  const resetCount = () => {
    setWarningCount(0);
    chrome.storage.local.set({ warningCount: 0 });
  };

  const volumeColor = 
    currentVolume > threshold ? '#F44336' :
    currentVolume > threshold * 0.8 ? '#FFC107' : '#4CAF50';

  return (
    <div className="popup-container">
      <h1>🎙️ Voice Monitor</h1>

      <div className="volume-meter">
        <div className="volume-label">Current Volume</div>
        <div className="volume-bar-container">
          <div
            className="volume-bar"
            style={{
              width: `${currentVolume * 100}%`,
              backgroundColor: volumeColor,
            }}
          />
        </div>
      </div>

      <div className="threshold-control">
        <label>
          Threshold: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.3"
          max="1.0"
          step="0.01"
          value={threshold}
          onChange={handleThresholdChange}
        />
      </div>

      <div className="warning-count">
        Warnings: <span className="count">{warningCount}</span>
        {warningCount > 0 && (
          <button className="reset-btn" onClick={resetCount}>
            Reset
          </button>
        )}
      </div>

      <button
        className={`monitor-button ${isMonitoring ? 'stop' : 'start'}`}
        onClick={isMonitoring ? stopMonitoring : startMonitoring}
      >
        {isMonitoring ? '⏹ Stop Monitoring' : '▶️ Start Monitoring'}
      </button>
    </div>
  );
}
