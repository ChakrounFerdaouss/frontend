import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.18:3000/api'; // IP de ton backend local

// 🔐 Authentification
export const login = async (username, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`, { username, password });
};

export const register = async (username, password) => {
  return axios.post(`${API_BASE_URL}/auth/register`, { username, password });
};

// 📓 Journal Entries
export const getJournals = async (token) => {
  return axios.get(`${API_BASE_URL}/journals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createJournal = async (token, journalData) => {
  return axios.post(`${API_BASE_URL}/journals`, journalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateJournal = async (token, journalId, journalData) => {
  return axios.put(`${API_BASE_URL}/journals/${journalId}`, journalData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteJournal = async (token, journalId) => {
  return axios.delete(`${API_BASE_URL}/journals/${journalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 😄 Mood Logs
export const getMoodLogs = async (token, date) => {
  return axios.get(`${API_BASE_URL}/moods`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { date },
  });
};

export const createMoodLog = async (token, moodData) => {
  return axios.post(`${API_BASE_URL}/moods`, moodData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMoodLog = async (token, moodId, moodData) => {
  return axios.put(`${API_BASE_URL}/moods/${moodId}`, moodData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteMoodLog = async (token, moodId) => {
  return axios.delete(`${API_BASE_URL}/moods/${moodId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 👤 User Profile (optionnel si implémenté côté backend)
export const getUserProfile = async (token) => {
  return axios.get(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (token, profileData) => {
  return axios.put(`${API_BASE_URL}/users/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};