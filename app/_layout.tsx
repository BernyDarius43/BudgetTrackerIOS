import { useFonts } from 'expo-font';
import { Slot, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/authContext/authContext';
import { GlobalProvider } from '@/context/GlobalContext';
import Toast from 'react-native-toast-message';
import { AuthBootstrapSkeleton } from '@/components/skeletons';

SplashScreen.preventAutoHideAsync();

function AuthHandler() {
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!navState?.key) return; // Wait for navigation state to be ready

    const inTabs = segments[0] === '(tabs)';

    if (currentUser && !inTabs) {
      router.replace('/(auth)/home-user');
      return;
    }

    if (!currentUser && inTabs) {
      router.replace('/');
    }
  }, [currentUser, router, navState, segments]);

  return null;
}

function LoadingGate() {
  const { loading } = useAuth();

   // 🔍 ADD THIS
  console.log('[LoadingGate] auth loading:', loading);


  return (
  <>
    <Slot />
    {loading && <AuthBootstrapSkeleton />}
  </>
);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <GlobalProvider>
        <AuthHandler />
        <LoadingGate />
        <Toast />
      </GlobalProvider>
    </AuthProvider>
  );
}
