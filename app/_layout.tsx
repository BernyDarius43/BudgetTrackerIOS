import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/authContext/authContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// A small component to handle authentication redirection.
function AuthHandler() {
  const { userLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log();
    
      const targetRoute = userLoggedIn ? '/(tabs)/home-user' : '/home';
      setTimeout(() => {
        router.replace(targetRoute);
      }, 0);
  }, [userLoggedIn, router]);

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthHandler />
      <Slot />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
