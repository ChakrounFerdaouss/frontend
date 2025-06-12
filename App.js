import React from 'react';
// Correct the import path for MainNavigator
import MainNavigator from './navigation/MainNavigator'; // Removed 'src/'

// Correct the import path for AuthProvider
import { AuthProvider } from './context/AuthContext'; // Removed 'src/'

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}