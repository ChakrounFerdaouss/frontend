import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ pour éviter les overlaps iOS/Android

const HomeScreen = ({ navigation }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.dateText}>{today}</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Mood')}>
        <Ionicons name="happy-outline" size={24} color="#8B8000" style={styles.icon} />
        <Text style={styles.cardText}>How are you feeling today?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEA',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // fallback pour Android
  },
  dateText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default HomeScreen;