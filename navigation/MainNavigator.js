import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppTabsNavigator from './AppTabsNavigator';
import { useAuth } from '../context/AuthContext';

export default function MainNavigator() {
  const { userToken, isLoading } = useAuth();

  // Écran de chargement pendant la récupération du token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppTabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
