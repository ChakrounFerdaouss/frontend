import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

dayjs.locale('en');

const HomeScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [quote, setQuote] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const today = dayjs().format('dddd, MMMM D'); // Example: Thursday, June 13

  useEffect(() => {
    // Random quote
    const quotes = [
      "You are not your thoughts.",
      "Every day is a new beginning.",
      "Take care of yourself—gently.",
      "You are enough as you are.",
    ];
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);

    // Load today's mood
    const loadTodayMood = async () => {
      try {
        const res = await api.getMoodLogs(userToken);
        const all = res.data;

        const todayStr = dayjs().format('YYYY-MM-DD');
        const filtered = all.filter((entry) =>
          entry.date.startsWith(todayStr)
        );

        if (filtered.length > 0) {
          const latest = filtered[filtered.length - 1];
          setTodayMood(latest);
        }
      } catch (err) {
        console.error('Error loading today\'s mood', err);
      }
    };

    if (userToken) loadTodayMood();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.dateText}>{today}</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Mood')}
      >
        <Ionicons name="happy-outline" size={24} color="#8B8000" style={styles.icon} />
        <Text style={styles.cardText}>How are you feeling today?</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quote of the Day</Text>
        <Text style={styles.quote}>{quote}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {todayMood ? (
          <Text style={styles.recent}>
            {todayMood.moodType} at {dayjs(todayMood.date).format('HH:mm')}
            {todayMood.notes ? ` — “${todayMood.notes}”` : ''}
          </Text>
        ) : (
          <Text style={styles.recent}>No mood entry yet for today.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEA',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  dateText: {
    fontSize: 26,
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
    marginBottom: 30,
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
  },
  recent: {
    fontSize: 15,
    color: '#888',
  },
});

export default HomeScreen;
