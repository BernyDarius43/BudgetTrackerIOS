// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://your-backend-url.com'; // Replace with your actual backend URL

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for logging errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    console.error('Response error:', error.response ? error.response.data : error.message);
    // Optionally, show user-friendly message or trigger a global error handler
    return Promise.reject(error);
  }
);

export default instance;
