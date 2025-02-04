import * as SecureStore from 'expo-secure-store';
import { AUTH_CONFIG } from '@/config';

export const storeAuthTokens = async (idToken: string | null | undefined, refreshToken: string | null | undefined) => {
    try {
        if (!idToken || !refreshToken) {
            console.error('Invalid tokens:', { idToken, refreshToken });
            throw new Error('Invalid authentication tokens received');
        }

        // Ensure tokens are strings and not empty
        const cleanIdToken = String(idToken).trim();
        const cleanRefreshToken = String(refreshToken).trim();

        if (!cleanIdToken || !cleanRefreshToken) {
            throw new Error('Empty tokens are not allowed');
        }

        await SecureStore.setItemAsync(AUTH_CONFIG.tokenStorageKey, cleanIdToken);
        await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenStorageKey, cleanRefreshToken);
    } catch (error) {
        console.error('Error storing auth tokens:', error);
        throw error;
    }
};

export const getAuthToken = async (): Promise<string | null> => {
    try {
        const token = await SecureStore.getItemAsync(AUTH_CONFIG.tokenStorageKey);
        return token ? token.trim() : null;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        const token = await SecureStore.getItemAsync(AUTH_CONFIG.refreshTokenStorageKey);
        return token ? token.trim() : null;
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const clearAuthTokens = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(AUTH_CONFIG.tokenStorageKey);
        await SecureStore.deleteItemAsync(AUTH_CONFIG.refreshTokenStorageKey);
    } catch (error) {
        console.error('Error clearing auth tokens:', error);
        throw error;
    }
}; 