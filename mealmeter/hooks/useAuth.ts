import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getAuthToken, clearAuthTokens } from '@/utils/secureStorage';
import { verifyToken } from '@/services/api/auth';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            // Verify token with backend
            const isValid = await verifyToken(token);
            setIsAuthenticated(isValid);

            const inAuthGroup = segments[0] === 'auth';
            if (!isValid && !inAuthGroup) {
                await clearAuthTokens();
                router.replace('/auth/login');
            } else if (isValid && inAuthGroup) {
                router.replace('/(tabs)');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            await clearAuthTokens();
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await clearAuthTokens();
            setIsAuthenticated(false);
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        isAuthenticated,
        isLoading,
        checkAuth,
        logout,
    };
}; 