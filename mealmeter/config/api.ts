import Constants from 'expo-constants';
import { Platform } from 'react-native';

const LOCAL_IP = '192.168.1.151'; // Your actual local IP address

const ENV = {
    dev: {
        apiUrl: Platform.select({
            ios: `http://${LOCAL_IP}:8000`,  // Use your local IP for iOS
            android: 'http://10.0.2.2:8000',   // Android emulator
            default: 'http://localhost:8000',   // Web
        }),
    },
    prod: {
        apiUrl: Constants.expoConfig?.extra?.apiUrl || 'https://api.mealmeter.com',
    },
};

export const getApiConfig = () => {
    const config = __DEV__ ? ENV.dev : ENV.prod;
    console.log('Current API URL:', config.apiUrl); // Debug log
    return config;
};

export const API_URL = getApiConfig().apiUrl; 