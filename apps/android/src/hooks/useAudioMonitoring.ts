import { useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { AudioService } from '../services/AudioService';
import { ThresholdDetector } from '@your-are-loud/core';
import { useAudio } from '../contexts/AudioContext';

export function useAudioMonitoring() {
  const {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    setCurrentVolume,
    setIsMonitoring,
    setVolumeThreshold,
    incrementWarningCount,
    resetWarningCount,
  } = useAudio();

  const audioServiceRef = useRef(new AudioService());
  const detectorRef = useRef(new ThresholdDetector(volumeThreshold));
  const lastWarningRef = useRef<number>(0);

  useEffect(() => {
    detectorRef.current.setThreshold(volumeThreshold);
  }, [volumeThreshold]);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });

      if (!permission) return false;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const startMonitoring = useCallback(async () => {
    const hasPermission = await requestPermissions();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Microphone access is required for voice monitoring.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await audioServiceRef.current.startMonitoring((volume) => {
        setCurrentVolume(volume);

        if (detectorRef.current.exceedsThreshold(volume)) {
          const now = Date.now();
          if (now - lastWarningRef.current >= 3000) {
            lastWarningRef.current = now;
            incrementWarningCount();
            // TODO: Show native notification
          }
        }
      });

      setIsMonitoring(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
      Alert.alert('Error', 'Failed to start audio monitoring');
    }
  }, [setCurrentVolume, setIsMonitoring, incrementWarningCount]);

  const stopMonitoring = useCallback(() => {
    audioServiceRef.current.stopMonitoring();
    setIsMonitoring(false);
    setCurrentVolume(0);
  }, [setIsMonitoring, setCurrentVolume]);

  useEffect(() => {
    return () => {
      if (isMonitoring) {
        audioServiceRef.current.stopMonitoring();
      }
    };
  }, [isMonitoring]);

  return {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    startMonitoring,
    stopMonitoring,
    setVolumeThreshold,
    resetWarningCount,
  };
}
