import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const MoodLogScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useAuth();

  const moods = [
    { type: 'Very Sad', emoji: '😢' },
    { type: 'Sad', emoji: '😐' },
    { type: 'Neutral', emoji: '😌' },
    { type: 'Happy', emoji: '🙂' },
    { type: 'Very Happy', emoji: '😁' },
  ];

  const tags = ['#work', '#gratitude', '#family'];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood');
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const moodData = {
        moodType: selectedMood.type,
        notes,
        date: now.toISOString(),
      };

      await api.createMoodLog(userToken, moodData);
      Alert.alert('✅ Saved', `Mood: ${selectedMood.type}`);
      setSelectedMood(null);
      setNotes('');
    } catch (error) {
      Alert.alert('Error', 'Could not save mood entry.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Mood Entry</Text>

      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodCircle,
              selectedMood?.type === mood.type && styles.moodCircleSelected,
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.moodLabel}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Notes (optional)"
        placeholderTextColor="#607389"
        multiline
        numberOfLines={4}
        value={notes}
        onChangeText={setNotes}
        style={styles.textArea}
      />

      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <Text key={tag} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveMood}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#3b4857',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '100%',
  },
  moodCircle: {
    backgroundColor: '#e8eef5',
    borderRadius: 40,
    padding: 15,
    borderWidth: 2,
    borderColor: '#c1ccd9',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodCircleSelected: {
    borderColor: '#a1b3cc',
    backgroundColor: '#fff',
  },
  moodLabel: {
    fontSize: 24,
  },
  textArea: {
    backgroundColor: '#e8eef5',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#c1ccd9',
    textAlignVertical: 'top',
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    color: '#3b4857',
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#7a8fa7',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
    color: '#f5f7fa',
    margin: 5,
  },
  saveButton: {
    backgroundColor: '#607389',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#f5f7fa',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoodLogScreen;
