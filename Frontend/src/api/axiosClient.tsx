import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual local IP if testing on physical device, or 10.0.2.2 for Android Emulator
// Assuming the user is running XAMPP/WAMP and the folder name is TaskManager
// Utilizing index.php as the router
export const BASE_URL = 'http://192.168.1.2/TaskManagerDemo/Backend/public'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('🔍 Axios Interceptor - Token retrieved:', token ? token.substring(0, 20) + '...' : 'NO TOKEN FOUND');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Axios Interceptor - Authorization header set');
    } else {
      console.log('⚠️ Axios Interceptor - No token available, request will be unauthorized');
    }
    return config;
  },
  (error) => {
    console.log('❌ Axios Interceptor - Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
