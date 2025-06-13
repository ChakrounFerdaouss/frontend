import React, { useEffect, useRef, useState } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const RippleCircle = ({ size, opacity, delay }) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 7500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 7500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          opacity,
          transform: [{ scale }],
          left: width / 2 - size / 2,
          top: height / 2 - size / 2,
        },
      ]}
    />
  );
};

const cyclingWords = [
  'Mindfulness',
  'Breathe',
  'Focus',
  'Balance',
  'Healing',
  'Rest',
  'Growth',
  'Check-in',
  'Calm',
  'Reflect',
];

const CyclingWord = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % cyclingWords.length);
        cycle();
      });
    };
    cycle();
  }, []);

  return (
    <Animated.Text style={[styles.cyclingWord, { opacity: fadeAnim }]}>
      {cyclingWords[index]}
    </Animated.Text>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    const result = await login(username, password);

    if (!result.success) {
      let message = result.message || 'Please check your credentials.';

      if (message.toLowerCase().includes('invalid credentials')) {
        message = 'Username does not exist';
      }

      Alert.alert('Login Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Ripple background */}
          <View style={StyleSheet.absoluteFill}>
            <RippleCircle size={1000} opacity={0.08} delay={0} />
            <RippleCircle size={800} opacity={0.1} delay={300} />
            <RippleCircle size={600} opacity={0.15} delay={600} />
            <RippleCircle size={400} opacity={0.2} delay={900} />
            <RippleCircle size={200} opacity={0.25} delay={1200} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <CyclingWord />

            <View style={styles.card}>
              <Text style={styles.title}>Welcome 🌿</Text>
              <Text style={styles.subtitle}>How are you feeling today?</Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#7a8fa7"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7a8fa7"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Log in</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  cyclingWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b4857',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 25,
    borderRadius: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#607389',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    color: '#3b4857',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#7a8fa7',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#e8eef5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderColor: '#dbe2eb',
    borderWidth: 1,
    color: '#3b4857',
  },
  button: {
    backgroundColor: '#607389',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#7a8fa7',
    fontSize: 14,
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#c1ccd9',
  },
});

export default LoginScreen;
