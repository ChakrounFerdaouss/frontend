import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import MoodCalendar from '../components/MoodCalendar';

const moodColors = {
  Sad: '#f44336',
  Neutral: '#ff9800',
  Happy: '#4caf50',
  Joyful: '#2196f3',
  'Very Sad': '#d32f2f',
  'Very Happy': '#2196f3',
};

const HistoryScreen = () => {
  const { userToken } = useAuth();
  const [moodLogs, setMoodLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const getLocalDateString = (isoString) => {
    const local = new Date(isoString);
    const year = local.getFullYear();
    const month = String(local.getMonth() + 1).padStart(2, '0');
    const day = String(local.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTime = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchMoodLogs = async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.getMoodLogs(userToken);
      const logs = response.data;
      setMoodLogs(logs);
      setError(null);

      const marked = {};
      logs.forEach((entry) => {
        const date = getLocalDateString(entry.date);
        marked[date] = {
          marked: true,
          dotColor: moodColors[entry.moodType] || '#000',
        };
      });

      setMarkedDates(marked);
    } catch (err) {
      console.error('Error fetching mood logs:', err.response?.data || err.message);
      setError('Failed to load moods.');
      Alert.alert('Error', 'Unable to load mood history.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMoodLogs();
    }, [userToken])
  );

  const handleDayPress = (day) => {
    const isSameDay = selectedDate === day.dateString;
    const newSelectedDate = isSameDay ? null : day.dateString;
    setSelectedDate(newSelectedDate);

    const updatedMarked = { ...markedDates };
    Object.keys(updatedMarked).forEach((key) => {
      updatedMarked[key] = {
        ...updatedMarked[key],
        selected: false,
      };
    });

    if (newSelectedDate && updatedMarked[newSelectedDate]) {
      updatedMarked[newSelectedDate] = {
        ...updatedMarked[newSelectedDate],
        selected: true,
        selectedColor: '#a1b3cc',
      };
    }

    setMarkedDates(updatedMarked);
  };

  const handleDeleteMood = (id) => {
    Alert.alert(
      'Delete mood entry?',
      'Are you sure you want to delete this mood?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteMoodLog(userToken, id);
              setMoodLogs((prev) => prev.filter((mood) => mood._id !== id));
              Alert.alert('Deleted', 'Mood entry removed.');
            } catch (error) {
              console.error('Delete failed:', error);
              Alert.alert('Error', 'Could not delete the mood.');
            }
          },
        },
      ]
    );
  };

  const filteredLogs = selectedDate
    ? moodLogs
        .filter((log) => getLocalDateString(log.date) === selectedDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : moodLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#a1b3cc" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MoodCalendar markedDates={markedDates} onDayPress={handleDayPress} />
        {filteredLogs.length === 0 ? (
          <Text style={styles.emptyText}>
            {selectedDate
              ? 'No mood logged on this day.'
              : 'No mood entries yet.'}
          </Text>
        ) : (
          filteredLogs.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.date}>{formatDateTime(item.date)}</Text>
                <TouchableOpacity onPress={() => handleDeleteMood(item._id)}>
                  <FontAwesome name="trash" size={18} color="#607389" />
                </TouchableOpacity>
              </View>
              <Text style={styles.mood}>Mood: {item.moodType || 'N/A'}</Text>
              <Text style={styles.notes} numberOfLines={1} ellipsizeMode="tail">
                {item.notes || 'No notes'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dbe2eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b4857',
  },
  mood: {
    fontSize: 15,
    fontWeight: '500',
    color: '#607389',
    marginTop: 6,
  },
  notes: {
    fontSize: 14,
    color: '#7a8fa7',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7a8fa7',
    textAlign: 'center',
    marginTop: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
  },
});

export default HistoryScreen;
