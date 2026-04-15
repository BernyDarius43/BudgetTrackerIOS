import { useFonts } from 'expo-font';
import { Slot, usePathname, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../context/authContext/authContext';
import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { GlobalProvider } from '@/context/GlobalContext';
import Toast from 'react-native-toast-message';
import { COLORS } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

/* function SkeletonBlock({ w, height, borderRadius = 12, style }: {
  w: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width: w, height, borderRadius, backgroundColor: COLORS.line, opacity },
        style,
      ]}
    />
  );
} */

/* function SkeletonScreen({ serverWaking }: { serverWaking: boolean }) {
  return (
    <View style={sk.container}>
      <Text style={sk.appName}>BudgetTracker</Text>

      {serverWaking ? (
        <Text style={sk.wakingText}>Starting up server...</Text>
      ) : null}

      <View style={sk.card}>
        <SkeletonBlock w={120} height={14} borderRadius={8} />
        <SkeletonBlock w={200} height={36} borderRadius={10} style={{ marginTop: 10 }} />
        <SkeletonBlock w={80} height={24} borderRadius={999} style={{ marginTop: 10 }} />
      </View>

      <View style={sk.card}>
        <SkeletonBlock w={100} height={14} borderRadius={8} />
        <SkeletonBlock w="100%" height={90} borderRadius={14} style={{ marginTop: 12 }} />
      </View>

      <View style={sk.card}>
        <SkeletonBlock w={160} height={14} borderRadius={8} />
        <View style={sk.txRow}>
          <SkeletonBlock w={40} height={40} borderRadius={20} />
          <SkeletonBlock w="60%" height={12} borderRadius={6} style={{ marginLeft: 12 }} />
        </View>
        <View style={sk.txRow}>
          <SkeletonBlock w={40} height={40} borderRadius={20} />
          <SkeletonBlock w="50%" height={12} borderRadius={6} style={{ marginLeft: 12 }} />
        </View>
        <View style={sk.txRow}>
          <SkeletonBlock w={40} height={40} borderRadius={20} />
          <SkeletonBlock w="55%" height={12} borderRadius={6} style={{ marginLeft: 12 }} />
        </View>
      </View>

      <View style={sk.actionsRow}>
        <SkeletonBlock w="48%" height={52} borderRadius={14} />
        <SkeletonBlock w="48%" height={52} borderRadius={14} />
      </View>
    </View>
  );
} */

function AuthHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const navState = useRootNavigationState();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!navState?.key) return;
    if (loading) return;

    const inTabs = segments[0] === '(tabs)';

    if (currentUser && !inTabs) {
      router.replace('/(auth)/home-user');
      return;
    }

    if (!currentUser && inTabs) {
      router.replace('/');
      return;
    }
  }, [currentUser, loading, pathname, router, navState, segments]);

  return null;
}

/* function LoadingGate() {
  const { loading, serverWaking } = useAuth();

  if (loading) {
    return <SkeletonScreen serverWaking={serverWaking} />;
  }

  return <Slot />;
} */

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
        <Slot/>
        <Toast />
      </GlobalProvider>
    </AuthProvider>
  );
}

const sk = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 18,
    paddingTop: 64,
  },
  appName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  wakingText: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});