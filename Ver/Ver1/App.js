import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import { ClassHome } from './components/classhome';

export default function App() {
  const Name="Abhay Kumar Singh"
  return (
    <View style={styles.container}>
      <Home Name={Name}/>
      <ClassHome Name={Name}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
