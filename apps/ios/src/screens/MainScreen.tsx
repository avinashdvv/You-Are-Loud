import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioMonitoring } from '../hooks/useAudioMonitoring';
import VolumeMeter from '../components/VolumeMeter';
import ThresholdSlider from '../components/ThresholdSlider';

export default function MainScreen() {
  const {
    currentVolume,
    isMonitoring,
    volumeThreshold,
    warningCount,
    startMonitoring,
    stopMonitoring,
    setVolumeThreshold,
    resetWarningCount,
  } = useAudioMonitoring();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Voice Monitor</Text>

      <VolumeMeter volume={currentVolume} threshold={volumeThreshold} />

      <ThresholdSlider value={volumeThreshold} onChange={setVolumeThreshold} />

      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>Warnings: {warningCount}</Text>
        {warningCount > 0 && (
          <TouchableOpacity onPress={resetWarningCount} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.monitorButton,
          isMonitoring ? styles.stopButton : styles.startButton,
        ]}
        onPress={isMonitoring ? stopMonitoring : startMonitoring}>
        <Text style={styles.buttonText}>
          {isMonitoring ? '⏹ Stop Monitoring' : '▶️ Start Monitoring'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  warningContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  warningText: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: 'bold',
  },
  resetButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  resetButtonText: {
    fontSize: 14,
  },
  monitorButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
