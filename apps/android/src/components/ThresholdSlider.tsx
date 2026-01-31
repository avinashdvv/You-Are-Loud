import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ThresholdSlider({ value, onChange }: ThresholdSliderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Warning Threshold: {value.toFixed(2)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0.3}
        maximumValue={1.0}
        step={0.01}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#E0E0E0"
      />
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
  slider: {
    width: '100%',
    height: 40,
  },
});
