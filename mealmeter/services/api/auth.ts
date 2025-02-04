import axios from 'axios';
import { API_URL } from '@/config/api';
import { Platform } from 'react-native';
import api from '../api';

interface AuthResponse {
    message: string;
    id_token: string;
    refresh_token: string;
    email: string;
}

interface SignupResponse {
    message: string;
    uid: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.id_token || !response.data.refresh_token) {
            throw new Error('Invalid response from server');
        }

        return {
            message: response.data.message,
            id_token: response.data.id_token,
            refresh_token: response.data.refresh_token,
            email: response.data.email
        };
    } catch (error: any) {
        if (error.response?.status === 422) {
            const detail = error.response.data.detail;
            if (Array.isArray(detail) && detail.length > 0) {
                throw new Error(detail[0]?.msg || detail[0] || 'Invalid input');
            }
        }

        if (error.message === 'Network Error') {
            throw new Error(`Unable to connect to server. Please check your connection.`);
        }

        if (error.response?.data?.detail) {
            const detail = error.response.data.detail;
            throw new Error(typeof detail === 'string' ? detail : 'Login failed');
        }

        throw new Error('Login failed. Please try again later');
    }
};

export const registerUser = async (email: string, password: string): Promise<SignupResponse> => {
    try {
        const response = await api.post('/auth/signup', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.uid) {
            throw new Error('Invalid response from server');
        }

        return {
            message: response.data.message,
            uid: response.data.uid
        };
    } catch (error: any) {
        if (error.response?.status === 422) {
            const detail = error.response.data.detail;
            if (Array.isArray(detail) && detail.length > 0) {
                throw new Error(detail[0]?.msg || detail[0] || 'Invalid input');
            }
        }

        if (error.message === 'Network Error') {
            throw new Error(`Unable to connect to server. Please check your connection.`);
        }

        if (error.response?.data?.detail) {
            const detail = error.response.data.detail;
            throw new Error(typeof detail === 'string' ? detail : 'Signup failed');
        }

        throw new Error('Failed to create account. Please try again later');
    }
};

export const verifyToken = async (token: string): Promise<boolean> => {
    try {
        const response = await api.get('/auth/verify', {
            params: { id_token: token }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}; 