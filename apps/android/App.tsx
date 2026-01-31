import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { AudioProvider } from './src/contexts/AudioContext';
import MainScreen from './src/screens/MainScreen';

function App(): JSX.Element {
  return (
    <AudioProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <MainScreen />
      </SafeAreaView>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
