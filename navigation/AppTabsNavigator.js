// src/navigation/AppTabsNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import MoodLogScreen from '../screens/MoodLogScreen';
import HistoryScreen from '../screens/HistoryScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';

const Tab = createBottomTabNavigator();
const JournalStack = createStackNavigator();

function JournalStackScreen() {
  return (
    <JournalStack.Navigator>
      <JournalStack.Screen
        name="JournalList"
        component={JournalScreen}
        options={{ headerShown: false }}
      />
      <JournalStack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{ title: 'New Entry' }}
      />
    </JournalStack.Navigator>
  );
}

const AppTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#5A67D8',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalStackScreen} />
      <Tab.Screen name="Mood" component={MoodLogScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default AppTabsNavigator;