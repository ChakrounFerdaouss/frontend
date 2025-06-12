import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // 👈 Assure-toi du bon chemin

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Champs manquants', 'Merci de remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const result = await register(username, password);
    if (!result.success) {
      Alert.alert('Échec d’inscription', result.message || 'Erreur inconnue.');
    }
    // Redirection automatique se fait via AuthContext (userToken)
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Créer un compte</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.registerText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFBEA',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFCC00',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#EEE',
    borderWidth: 1,
  },
  registerButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    textAlign: 'center',
    color: '#1976D2',
    marginTop: 15,
    fontSize: 14,
  },
});
