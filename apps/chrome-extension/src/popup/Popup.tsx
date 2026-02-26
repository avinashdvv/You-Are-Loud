import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Popup.css';

interface VolumeDataPoint {
  volume: number;
  timestamp: number;
}

export default function Popup() {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threshold, setThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);
  const [volumeHistory, setVolumeHistory] = useState<VolumeDataPoint[]>([]);
  const historyDuration = 600000; // Keep 10 minutes of history (10 * 60 * 1000)

  // Transform volume history for Recharts
  const chartData = useMemo(() => {
    if (volumeHistory.length === 0) return [];
    
    const now = Date.now();
    return volumeHistory.map(point => ({
      time: point.timestamp,
      timeLabel: new Date(point.timestamp).toLocaleTimeString(),
      volume: point.volume * 100, // Convert to percentage
      volumeRaw: point.volume,
    }));
  }, [volumeHistory]);

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
        const volume = request.volume;
        const timestamp = Date.now();
        setCurrentVolume(volume);
        
        // Add to history
        setVolumeHistory(prev => {
          const newHistory = [...prev, { volume, timestamp }];
          // Remove data points older than historyDuration
          const cutoffTime = timestamp - historyDuration;
          return newHistory.filter(point => point.timestamp > cutoffTime);
        });
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
        setVolumeHistory([]);
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
        <div className="volume-label">
          Volume Monitor (10m)
          <span className="volume-percentage" style={{ color: volumeColor }}>
            {(currentVolume * 100).toFixed(0)}%
          </span>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey="timeLabel" 
                stroke="#666"
                fontSize={10}
                tick={{ fill: '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#666"
                fontSize={10}
                tick={{ fill: '#666' }}
                label={{ value: 'Volume %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}%`, 'Volume'] : ['', '']}
                labelFormatter={(label: React.ReactNode) => `Time: ${label}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <ReferenceLine 
                y={threshold * 100} 
                stroke="#FF5722" 
                strokeDasharray="5 5"
                label={{ value: `Threshold: ${(threshold * 100).toFixed(0)}%`, position: 'top', fill: '#FF5722' }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#2196F3"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                dot={false}
                activeDot={{ r: 6, fill: volumeColor, stroke: volumeColor, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="volume-graph-empty">
            {isMonitoring ? 'Listening...' : 'Start monitoring to see volume graph'}
          </div>
        )}
        <div className="volume-status">
          {currentVolume > threshold ? (
            <span className="status-loud">🔊 Too Loud!</span>
          ) : currentVolume > threshold * 0.8 ? (
            <span className="status-warning">⚠️ Getting Loud</span>
          ) : isMonitoring ? (
            <span className="status-normal">✓ Normal</span>
          ) : (
            <span className="status-idle">Monitoring Off</span>
          )}
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
