// src/screens/JournalScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext'; // To get the user token
import * as api from '../services/api'; // To call your backend API
import { useFocusEffect } from '@react-navigation/native'; // For refetching when screen is focused

const JournalScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [journals, setJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch journal entries
  const fetchJournals = useCallback(async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.getJournals(userToken); // Call your API to get journals
      setJournals(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching journals:', err.response?.data || err.message);
      setError('Failed to fetch journals. ' + (err.response?.data?.message || 'Please try again.'));
      Alert.alert('Error', 'Failed to fetch journals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userToken]); // Dependencies for useCallback

  // Use useFocusEffect to refetch data whenever the screen comes into focus
  // This is useful after creating a new journal entry
  useFocusEffect(
    useCallback(() => {
      fetchJournals();
    }, [fetchJournals])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5A67D8" />
        <Text>Loading Journals...</Text>
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

  const renderItem = ({ item }) => (
    <View style={styles.journalItem}>
      <Text style={styles.journalDate}>{item.date}</Text> {/* Assuming 'date' field */}
      <Text style={styles.journalTitle}>{item.title}</Text> {/* Assuming 'title' field */}
      <Text style={styles.journalContent} numberOfLines={2}>{item.content}</Text> {/* Assuming 'content' field */}
      {/* You can add a full view button here later */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Journal Entries</Text>
      {journals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No journal entries yet. Tap below to create your first one!</Text>
        </View>
      ) : (
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id.toString()} // Assuming each journal has a unique 'id'
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add New Journal Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('JournalEntry')} // Navigate to the new entry screen
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  journalItem: {
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
  journalDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5A67D8',
    marginBottom: 5,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  journalContent: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 80, // Make space for the floating add button
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#5A67D8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30, // Adjust line height to center '+' vertically
  },
});

export default JournalScreen;
