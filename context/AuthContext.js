import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cette ligne permet de forcer le logout à chaque ouverture de l'application
  useEffect(() => {
    AsyncStorage.removeItem('token'); // ← supprime le token à chaque démarrage
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.login(username, password);
      const token = response.data.token;
      if (!token) throw new Error('Token manquant');
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Échec de la connexion.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.register(username, password);
      const token = response.data.token;
      if (!token) throw new Error('Token manquant');
      await AsyncStorage.setItem('token', token);
      setUserToken(token);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Échec de l’inscription.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
