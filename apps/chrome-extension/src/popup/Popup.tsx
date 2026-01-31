import React, { useState, useEffect } from 'react';
import { AudioMonitor } from '../services/AudioMonitor';
import './Popup.css';

export default function Popup() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threshold, setThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);
  const [audioMonitor] = useState(() => new AudioMonitor(threshold));

  useEffect(() => {
    // Load saved settings
    chrome.storage.local.get(['threshold', 'warningCount'], (result) => {
      if (result.threshold) {
        setThreshold(result.threshold);
        audioMonitor.setThreshold(result.threshold);
      }
      if (result.warningCount !== undefined) {
        setWarningCount(result.warningCount);
      }
    });

    return () => {
      if (isMonitoring) {
        audioMonitor.stopMonitoring();
      }
    };
  }, []);

  const startMonitoring = async () => {
    try {
      await audioMonitor.startMonitoring((volume) => {
        setCurrentVolume(volume);
      });
      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      alert('Microphone access denied. Please grant permission.');
    }
  };

  const stopMonitoring = () => {
    audioMonitor.stopMonitoring();
    setIsMonitoring(false);
    setCurrentVolume(0);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = parseFloat(e.target.value);
    setThreshold(newThreshold);
    audioMonitor.setThreshold(newThreshold);
    chrome.storage.local.set({ threshold: newThreshold });
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
