import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainNavigator from './navigation/MainNavigator';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}