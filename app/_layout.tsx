import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Redirect } from 'expo-router';
import { AuthProvider, useAuth } from '../context/authContext/authContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StrictMode, useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component to handle authentication-based redirection.
function AuthHandler() {
  const { userLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const targetRoute = userLoggedIn ? '/(tabs)/home-user' : '/home';
    // Slight delay to ensure navigation happens after the initial render.
    setTimeout(() => {
      router.replace(targetRoute);
    }, 0);
  }, [userLoggedIn, router]);

  return null;
}


export default function RootLayout() {
  // Load custom fonts.
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // Add other fonts here if needed
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen as soon as fonts are loaded.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // If fonts are not loaded, don't render anything yet (keep splash screen visible).
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <StrictMode>
    <AuthProvider>
      <AuthHandler />
      <Slot />
    </AuthProvider>
    </StrictMode>
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
