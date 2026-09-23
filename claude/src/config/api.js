import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your machine's local IP Address
const HOST = '192.168.29.119'; 
const API_URL = `http://${HOST}:5000/api`;

axios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    // If backend returns a standardized { success: true, data: ... } response, unwrap the data
    // Keep response.data.token logic intact for auth endpoints
    if (response.data && response.data.success && response.data.data !== undefined) {
      // Create a shallow copy to preserve other properties if needed
      response.data = response.data.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export { API_URL };
