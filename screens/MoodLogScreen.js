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
      Alert.alert('Sélectionnez une humeur.');
      return;
    }

    setIsLoading(true);
    try {
      const moodData = {
        moodType: selectedMood.type,
        notes,
        date: new Date().toISOString(), // 👈 horodatage complet pour éviter les doublons
      };

      await api.createMoodLog(userToken, moodData);
      Alert.alert('✅ Enregistré', `Humeur : ${selectedMood.type}`);
      setSelectedMood(null);
      setNotes('');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l’enregistrement.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle humeur</Text>

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
        placeholder="Notes (optionnel)"
        placeholderTextColor="#999"
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMood} disabled={isLoading}>
        <Text style={styles.saveButtonText}>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fffbea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#333',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '100%',
  },
  moodCircle: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 15,
    borderWidth: 2,
    borderColor: '#eee',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodCircleSelected: {
    borderColor: '#ffcc00',
    backgroundColor: '#fffde7',
  },
  moodLabel: {
    fontSize: 24,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'top',
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#ffecb3',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 14,
    color: '#333',
    margin: 5,
  },
  saveButton: {
    backgroundColor: '#fbc02d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MoodLogScreen;
