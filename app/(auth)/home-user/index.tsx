// app/(auth)/home-user/index.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { useRouter } from 'expo-router';
import { type ThemeColors } from '@/constants/Colors';
import { useIncomeContext } from "@/context/IncomeContext";
import { useExpenseContext } from "@/context/ExpenseContext";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock, SkeletonCard } from '@/components/skeletons';

export default function HomePageUserScreen() {
  const { currentUser, userLoggedIn, authMongoUser, serverWaking } = useAuth();
  const router = useRouter();
  const { getAllIncomes } = useIncomeContext();
  const { getExpenses } = useExpenseContext();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const hasFetchedRef = useRef(false); // ✅ run-once guard

  useEffect(() => {
    // Wait until the backend is awake AND the Mongo user is hydrated.
    if (!userLoggedIn) return;
    if (serverWaking) return;
    if (!authMongoUser) return;
    if (hasFetchedRef.current) return; // ✅ never run twice

    hasFetchedRef.current = true;

    (async () => {
      try {
        await Promise.all([getAllIncomes(), getExpenses()]);
      } catch (err: any) {
        console.error('[home-user] bootstrap fetch failed:', err?.message);
        // Allow a manual retry (pull-to-refresh) if the first try failed.
        hasFetchedRef.current = false;
      }
    })();
  }, [userLoggedIn, authMongoUser, serverWaking, getAllIncomes, getExpenses]); // ✅ guarded fetch

  if (serverWaking || !authMongoUser) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.welcomeCard}>
            <SkeletonBlock width={92} height={16} borderRadius={6} />
            <SkeletonBlock width="68%" height={32} borderRadius={10} style={{ marginTop: 10 }} />
            <SkeletonBlock width={180} height={16} borderRadius={6} style={{ marginTop: 10 }} />
          </View>

          <SkeletonBlock width="100%" height={56} borderRadius={14} />

          <View style={styles.quickActions}>
            <SkeletonCard compact />
            <SkeletonCard compact />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        {userLoggedIn && currentUser?.email ? (
          <>
            <View style={styles.welcomeCard}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>
                {currentUser?.displayName || currentUser.email.split('@')[0]}
              </Text>
              <Text style={styles.subText}>Ready to track your finances?</Text>
            </View>

            <Pressable
              style={styles.dashboardBtn}
              onPress={() => router.push('/(tabs)/dashboard')}
            >
              <Text style={styles.btnText}>Go to Dashboard</Text>
            </Pressable>

            <View style={styles.quickActions}>
              <Pressable
                style={[styles.actionCard, { borderColor: colors.green }]}
                onPress={() => router.push('/(tabs)/income')}
              >
                <Text style={styles.actionTitle}>Income</Text>
                <Text style={styles.actionSubtitle}>Track earnings</Text>
              </Pressable>

              <Pressable
                style={[styles.actionCard, { borderColor: colors.red }]}
                onPress={() => router.push('/(tabs)/expense')}
              >
                <Text style={styles.actionTitle}>Expenses</Text>
                <Text style={styles.actionSubtitle}>Monitor spending</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.notLoggedIn}>
            <Text style={styles.notLoggedText}>You are not logged in</Text>
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.btnText}>Log In</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: 18, justifyContent: 'center' },
  welcomeCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
  },
  greeting: { color: colors.muted, fontSize: 16, marginBottom: 8 },
  userName: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: 12 },
  subText: { color: colors.muted, fontSize: 15 },
  dashboardBtn: {
    backgroundColor: colors.green,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnText: { color: colors.bg, fontSize: 16, fontWeight: '800' },
  quickActions: { flexDirection: 'row', gap: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: colors.panel2,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 20,
  },
  actionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  actionSubtitle: { color: colors.muted, fontSize: 13 },
  notLoggedIn: { alignItems: 'center' },
  notLoggedText: { color: colors.text, fontSize: 18, marginBottom: 24 },
  loginBtn: {
    backgroundColor: colors.blue,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
});
