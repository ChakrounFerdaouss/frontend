import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { register } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    }

    try {
      const response = await register(username, password);
      Alert.alert('Succès', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error?.response?.data?.message || 'Échec de l’inscription');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Créer un compte</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Button title="Créer mon compte" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}>
          J’ai déjà un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}
