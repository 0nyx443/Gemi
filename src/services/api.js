import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Get auth token from storage
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Make API request with auth header
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('authToken');
        throw new Error('Unauthorized');
      }
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Workout APIs
export const workoutAPI = {
  getAll: () => apiRequest('/workouts'),
  getById: (id) => apiRequest(`/workouts/${id}`),
  create: (workout) =>
    apiRequest('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    }),
  update: (id, workout) =>
    apiRequest(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    }),
  delete: (id) =>
    apiRequest(`/workouts/${id}`, {
      method: 'DELETE',
    }),
};

// Diet APIs
export const dietAPI = {
  getAll: () => apiRequest('/diet'),
  create: (meal) =>
    apiRequest('/diet', {
      method: 'POST',
      body: JSON.stringify(meal),
    }),
  update: (id, meal) =>
    apiRequest(`/diet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meal),
    }),
  delete: (id) =>
    apiRequest(`/diet/${id}`, {
      method: 'DELETE',
    }),
};

// Progress APIs
export const progressAPI = {
  getAll: () => apiRequest('/progress'),
  create: (data) =>
    apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};
