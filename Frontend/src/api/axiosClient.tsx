import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual local IP if testing on physical device, or 10.0.2.2 for Android Emulator
// Assuming the user is running XAMPP/WAMP and the folder name is TaskManager
// Utilizing index.php as the router
export const BASE_URL = 'http://10.0.2.2/TaskManager/Backend/public/index.php'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
