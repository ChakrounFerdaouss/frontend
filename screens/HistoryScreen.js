import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext'; // ✅ C'EST CETTE LIGNE QUI MANQUAIT
import * as api from '../services/api';

const HistoryScreen = () => {
  const { userToken } = useAuth();
  const [moodLogs, setMoodLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodLogs = async () => {
      if (!userToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.getMoodLogs(userToken);
        setMoodLogs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mood logs:', err.response?.data || err.message);
        setError('Erreur lors du chargement des humeurs.');
        Alert.alert('Erreur', 'Impossible de charger l’historique.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodLogs();
  }, [userToken]);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
      <Text style={styles.mood}>Mood: {item.moodType || 'N/A'}</Text>
      <Text style={styles.notes} numberOfLines={1} ellipsizeMode="tail">
        {item.notes || 'No notes'}
      </Text>
    </TouchableOpacity>
  );

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

  if (moodLogs.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.emptyText}>Aucune humeur enregistrée pour le moment.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moodLogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },
  listContent: {
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
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default HistoryScreen;