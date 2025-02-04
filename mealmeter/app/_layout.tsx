import { useEffect } from 'react';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuthToken } from '@/utils/secureStorage';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LogBox } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings if needed
LogBox.ignoreLogs([
  'Bridgeless mode is enabled',
  'JavaScript logs will be removed from Metro'
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;

    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        const inAuthGroup = segments[0] === 'auth';

        if (!token && !inAuthGroup) {
          // Redirect to login if no token and not already in auth group
          router.replace('/auth/login');
        } else if (token && inAuthGroup) {
          // Redirect to home if has token but still in auth group
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/auth/login');
      }
    };

    checkAuth();
  }, [loaded, segments]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
