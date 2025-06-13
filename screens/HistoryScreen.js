import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import MoodCalendar from '../components/MoodCalendar';

const moodColors = {
  Sad: '#f44336',
  Neutral: '#ff9800',
  Happy: '#4caf50',
  Joyful: '#2196f3',
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
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' à ' + d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useFocusEffect(
    React.useCallback(() => {
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
            const color = moodColors[entry.moodType] || '#000';

            if (!marked[date]) {
              marked[date] = { dots: [{ color }], marked: true };
            } else {
              const existingColors = marked[date].dots.map((dot) => dot.color);
              if (!existingColors.includes(color)) {
                marked[date].dots.push({ color });
              }
            }
          });

          setMarkedDates(marked);
        } catch (err) {
          console.error('Error fetching mood logs:', err.response?.data || err.message);
          setError('Erreur lors du chargement des humeurs.');
          Alert.alert('Erreur', 'Impossible de charger l’historique.');
        } finally {
          setIsLoading(false);
        }
      };

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
        selectedColor: '#F2C94C',
      };
    }

    setMarkedDates(updatedMarked);
  };

  const filteredLogs = selectedDate
    ? moodLogs
        .filter((log) => getLocalDateString(log.date) === selectedDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : moodLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#F2C94C" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
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
              ? "Aucune humeur enregistrée pour ce jour."
              : "Aucune humeur enregistrée pour le moment."}
          </Text>
        ) : (
          filteredLogs.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.date}>{formatDateTime(item.date)}</Text>
              <Text style={styles.mood}>Humeur : {item.moodType || 'N/A'}</Text>
              <Text style={styles.notes} numberOfLines={3} ellipsizeMode="tail">
                {item.notes || 'Aucune note'}
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
    backgroundColor: '#FFFBEA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F7E9B8',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B8000',
    marginBottom: 4,
  },
  mood: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBEA',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 30,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default HistoryScreen;