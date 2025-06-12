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
import { useAuth } from '../context/AuthContext'; // 👈 Assure-toi que le chemin est bon

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    const result = await login(username, password);
    if (!result.success) {
      Alert.alert('Échec de connexion', result.message || 'Vérifiez vos identifiants.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Connexion</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Pas encore de compte ? Créer un compte</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9C4',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#FBC02D',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#1976D2',
    fontSize: 14,
  },
});

export default LoginScreen;
