import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VolumeMeterProps {
  volume: number;
  threshold: number;
}

export default function VolumeMeter({ volume, threshold }: VolumeMeterProps) {
  const getVolumeColor = (): string => {
    if (volume > threshold) return '#F44336';
    if (volume > threshold * 0.8) return '#FFC107';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Volume</Text>
      <View style={styles.meterContainer}>
        <View
          style={[
            styles.meterBar,
            {
              width: `${volume * 100}%`,
              backgroundColor: getVolumeColor(),
            },
          ]}
        />
      </View>
      <Text style={styles.percentage}>{(volume * 100).toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meterContainer: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  meterBar: {
    height: '100%',
    borderRadius: 12,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
});
