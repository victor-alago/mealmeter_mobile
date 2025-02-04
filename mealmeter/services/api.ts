import axios from 'axios';
import { Platform } from 'react-native';
import { API_URL } from '@/config/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers,
        });
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
        });
        return response;
    },
    error => {
        console.error('API Response Error:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status,
        });
        return Promise.reject(error);
    }
);

export const uploadImage = async (imageUri: string) => {
    try {
        console.log('Starting image upload...', imageUri);

        // Create form data with the correct structure
        const formData = new FormData();

        // Add the image file with the correct metadata
        formData.append('image', {
            uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
            type: 'image/jpeg',
            name: 'food.jpg',
        } as any);

        console.log('Sending request to:', `${API_URL}/food-recognition`);

        const response = await api.post('/food-recognition', formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: (data) => {
                return data; // Don't transform the FormData
            },
        });

        console.log('Upload successful:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Upload error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });

        if (error.response?.status === 400) {
            throw new Error(error.response.data.detail || 'Invalid image format');
        }
        if (error.response?.status === 500) {
            throw new Error('Server error. Please try again.');
        }
        throw new Error(`Upload failed: ${error.message}`);
    }
};

export default api; 