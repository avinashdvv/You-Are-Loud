import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AudioState {
  currentVolume: number;
  isMonitoring: boolean;
  volumeThreshold: number;
  warningCount: number;
}

interface AudioContextType extends AudioState {
  setCurrentVolume: (volume: number) => void;
  setIsMonitoring: (monitoring: boolean) => void;
  setVolumeThreshold: (threshold: number) => void;
  incrementWarningCount: () => void;
  resetWarningCount: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [volumeThreshold, setVolumeThreshold] = useState(0.7);
  const [warningCount, setWarningCount] = useState(0);

  const incrementWarningCount = () => setWarningCount(prev => prev + 1);
  const resetWarningCount = () => setWarningCount(0);

  const value: AudioContextType = {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    setCurrentVolume,
    setIsMonitoring,
    setVolumeThreshold,
    incrementWarningCount,
    resetWarningCount,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
