import React, { createContext, useContext, useState } from 'react'; // <--- Add useContext here
import * as api from '../services/api'; // Make sure this path is correct based on your file structure

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); // Renamed 'user' to 'userToken' for clarity based on previous discussions
  const [isLoading, setIsLoading] = useState(false); // Added for loading state

  const login = async (username, password) => { // Made async to handle API call
    setIsLoading(true);
    try {
      const response = await api.login(username, password); // Call your backend API
      const token = response.data.token; // Assuming your backend returns a token
      setUserToken(token); // Set the token
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password) => { // Added register function
    setIsLoading(true);
    try {
      const response = await api.register(username, password);
      setIsLoading(false);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserToken(null);
    // In a real app, you'd remove the token from AsyncStorage here
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// <--- This is the missing part!
export const useAuth = () => {
  return useContext(AuthContext);
};