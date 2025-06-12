// src/screens/MoodLogScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // Correct path to context from screen
import * as api from '../services/api';     // Correct path to services from screen

const MoodLogScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useAuth();

  const moods = [
    { type: 'Very Sad', emoji: '😭', value: 1 },
    { type: 'Sad', emoji: '😞', value: 2 },
    { type: 'Neutral', emoji: '😐', value: 3 },
    { type: 'Happy', emoji: '😊', value: 4 },
    { type: 'Very Happy', emoji: '😄', value: 5 },
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Selection Missing', 'Please select a mood before saving.');
      return;
    }

    setIsLoading(true);
    try {
      // --- START OF CRITICAL ADDITION / CORRECTION ---
      // Get the current date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

      const moodData = {
        moodType: selectedMood.type,
        notes: notes,
        date: currentDate, // <--- THIS IS THE ESSENTIAL LINE!
      };

      console.log('Frontend sending moodData:', moodData); // Debug log to verify

      // --- END OF CRITICAL ADDITION / CORRECTION ---

      await api.createMoodLog(userToken, moodData);
      Alert.alert('Success', 'Mood saved successfully!');
      setSelectedMood(null); // Reset form
      setNotes(''); // Reset notes
    } catch (error) {
      console.error('Failed to save mood:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save mood.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      {/* Mood Selector */}
      <View style={styles.moodSelectorContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodOption,
              selectedMood?.type === mood.type && styles.selectedMoodOption,
            ]}
            onPress={() => setSelectedMood(mood)}
            disabled={isLoading}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.moodText}>{mood.type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes Input */}
      <Text style={styles.label}>Notes (Optional)</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Feeling overwhelmed..."
        multiline
        value={notes}
        onChangeText={setNotes}
        editable={!isLoading}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveMood}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Save Mood'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  moodSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
  },
  moodOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '18%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
    backgroundColor: '#fff',
    padding: 5,
  },
  selectedMoodOption: {
    borderColor: '#5A67D8',
    borderWidth: 2,
    backgroundColor: '#e6e8fa',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 5,
  },
  moodText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 10,
    marginTop: 20,
  },
  notesInput: {
    width: '90%',
    minHeight: 100,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 30,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MoodLogScreen;