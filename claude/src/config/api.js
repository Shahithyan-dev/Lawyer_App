import { Platform } from 'react-native';

// Hardcoding your machine IP since physical devices can't use 10.0.2.2 or localhost
const HOST = '192.168.1.53'; 
const API_URL = `http://${HOST}:5000/api`;

console.log('🌍 API_URL is set to:', API_URL);

export { API_URL };
