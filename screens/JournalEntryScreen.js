// src/screens/JournalEntryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const JournalEntryScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userToken } = useAuth();

  const handleSaveJournal = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Fields', 'Please enter both a title and content for your journal entry.');
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

      const journalData = {
        title: title.trim(),
        content: content.trim(),
        date: currentDate, // Send the current date
      };

      console.log('Saving journal entry:', journalData); // For debugging
      await api.createJournal(userToken, journalData);
      Alert.alert('Success', 'Journal entry saved successfully!');
      navigation.goBack(); // Go back to the Journal list after saving
    } catch (error) {
      console.error('Failed to save journal entry:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save journal entry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>New Journal Entry</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Today's thoughts..."
          value={title}
          onChangeText={setTitle}
          editable={!isLoading}
          maxLength={100} // Optional: limit title length
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="Write about your day, feelings, experiences..."
          multiline
          value={content}
          onChangeText={setContent}
          editable={!isLoading}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveJournal}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 15,
  },
  titleInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  contentInput: {
    width: '100%',
    minHeight: 200, // Make content area larger
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 30,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JournalEntryScreen;