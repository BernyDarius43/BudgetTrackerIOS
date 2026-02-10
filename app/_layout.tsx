import { useFonts } from 'expo-font';
import { Slot, usePathname, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/authContext/authContext';
import { StrictMode, useEffect } from 'react';
import { GlobalProvider } from '@/context/GlobalContext';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Component to handle authentication-based redirection.
function AuthHandler() {
  const { userLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const navState = useRootNavigationState();

  const { currentUser, loading } = useAuth();
  
  useEffect(() => {
        // 1) Wait for the root navigator to mount
    if (!navState?.key) return;

    // 2) Optional: wait for auth to resolve initial state
    if (loading) return;

    const inTabs = segments[0] === "(tabs)";

    // Logged in -> must be inside tabs
    if (currentUser && !inTabs) {
      router.replace("/(auth)/home-user");
      return;
    }

    // Logged out -> must be outside tabs (landing page)
    if (!currentUser && inTabs) {
      router.replace("/");
      return;
    }
  }, [userLoggedIn, pathname, router]); 
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
       <GlobalProvider>
        <AuthHandler />
          <Slot />
          <Toast />
        </GlobalProvider>
      </AuthProvider>
    </StrictMode>
  );
}

/* const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
 */