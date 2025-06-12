import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// Removed createNativeStackNavigator from here as it's used inside AuthNavigator now

import AuthNavigator from './AuthNavigator'; // Import the AuthNavigator you created
import AppTabsNavigator from './AppTabsNavigator'; // Import the AppTabsNavigator you created
import { useAuth } from '../context/AuthContext'; // Import your AuthContext hook

export default function MainNavigator() {
  const { userToken } = useAuth(); // Get the userToken from your AuthContext

  return (
    <NavigationContainer>
      {/* Conditionally render navigators based on authentication status */}
      {userToken ? <AppTabsNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}