// src/screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext'; // To get the user token
import * as api from '../services/api'; // To call your backend API

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
        // We're calling getMoodLogs WITHOUT a specific date, month, or year.
        // Your backend's GET /moods route should then return all moods for the user.
        const response = await api.getMoodLogs(userToken);
        setMoodLogs(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching mood logs:', err.response?.data || err.message);
        setError('Failed to fetch mood logs. ' + (err.response?.data?.message || 'Please try again.'));
        Alert.alert('Error', 'Failed to fetch mood logs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodLogs();
  }, [userToken]); // Re-fetch if userToken changes

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5A67D8" />
        <Text>Loading Mood History...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (moodLogs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No mood logs found yet. Go to the Mood tab to record one!</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.moodItem}>
      <Text style={styles.moodDate}>{item.date}</Text>
      <Text style={styles.moodType}>Mood: {item.moodType}</Text>
      {item.notes && <Text style={styles.moodNotes}>Notes: {item.notes}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Mood History</Text>
      <FlatList
        data={moodLogs}
        keyExtractor={(item) => item.id.toString()} // Assuming each mood log has a unique 'id'
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moodDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A67D8',
    marginBottom: 5,
  },
  moodType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  moodNotes: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20, // Add some padding at the bottom of the list
  },
});

export default HistoryScreen;