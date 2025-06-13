import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/en';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

dayjs.extend(utc);
dayjs.locale('en');

const moodScores = {
  Awful: 1,
  Sad: 2,
  Bad: 2,
  Meh: 3,
  Neutral: 3,
  Okay: 3,
  Good: 4,
  Happy: 5,
  Great: 5,
};

const HomeScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [quote, setQuote] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const today = dayjs().format('dddd, MMMM D');

  useFocusEffect(
    useCallback(() => {
      const quotes = [
        "You are not your thoughts.",
        "Every day is a new beginning.",
        "Take care of yourself—gently.",
        "You are enough as you are.",
      ];
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

      const loadTodayMood = async () => {
        try {
          const res = await api.getMoodLogs(userToken);
          const all = res.data;
          const todayStr = dayjs().format('YYYY-MM-DD');

          const filtered = all.filter((entry) => {
            if (!entry.date) return false;
            const localDate = dayjs(entry.date).utc().local().format('YYYY-MM-DD');
            return localDate === todayStr;
          });

          if (filtered.length > 0) {
            const latest = filtered.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            setTodayMood(latest);
          } else {
            setTodayMood(null);
          }
        } catch (err) {
          console.error("Error loading today's mood", err);
        }
      };

      const loadWeeklyMood = async () => {
        try {
          const res = await api.getMoodLogs(userToken);
          const all = res.data;

          const today = dayjs();
          const last7 = [...Array(7)].map((_, i) => today.subtract(6 - i, 'day'));
          const keys = last7.map(date => date.format('YYYY-MM-DD'));
          const labels = last7.map(date => date.format('dd'));

          const moodMap = {};
          all.forEach((entry) => {
            if (!entry.date) return;
            const localDate = dayjs(entry.date).utc().local().format('YYYY-MM-DD');
            if (
              !moodMap[localDate] ||
              dayjs(entry.date).isAfter(moodMap[localDate].date)
            ) {
              moodMap[localDate] = entry;
            }
          });

          const data = keys.map((date) => {
            const mood = moodMap[date]?.moodType;
            const score = moodScores[mood] || 0;
            return score;
          });

          setChartData({ labels, data });
        } catch (err) {
          console.error('Error loading weekly mood data:', err);
        }
      };

      if (userToken) {
        loadTodayMood();
        loadWeeklyMood();
      }
    }, [userToken])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.dateText}>{today}</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Mood')}
      >
        <Ionicons name="happy-outline" size={24} color="#607389" style={styles.icon} />
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
          <Text style={styles.recent}>No mood entry recorded today.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood This Week</Text>
        {chartData.data.length === 7 ? (
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.data }],
            }}
            width={Dimensions.get('window').width - 40}
            height={200}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#f5f7fa',
              backgroundGradientFrom: '#f5f7fa',
              backgroundGradientTo: '#f5f7fa',
              decimalPlaces: 0,
              color: () => '#607389',
              labelColor: () => '#607389',
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#3b4857',
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        ) : (
          <Text style={styles.recent}>No mood data yet.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  dateText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b4857',
    marginBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8eef5',
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
    color: '#3b4857',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#607389',
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7a8fa7',
  },
  recent: {
    fontSize: 15,
    color: '#a1b3cc',
  },
});

export default HomeScreen;
