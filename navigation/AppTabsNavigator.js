// src/navigation/AppTabsNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MoodLogScreen from '../screens/MoodLogScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

const AppTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#607389',     // Active tab color
        tabBarInactiveTintColor: '#a1b3cc',   // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#f5f7fa',         // Tab bar background
          paddingBottom: 5,
          paddingTop: 5,
          borderTopColor: '#c1ccd9',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Mood') iconName = 'smile';
          else if (route.name === 'History') iconName = 'history';

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodLogScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default AppTabsNavigator;
