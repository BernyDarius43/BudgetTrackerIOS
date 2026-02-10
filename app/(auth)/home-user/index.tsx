// app/(tabs)/home-user/index.tsx
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';

import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useIncomeContext } from "@/context/IncomeContext";
import { useExpenseContext } from "@/context/ExpenseContext";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomePageUserScreen() {
  const { currentUser, userLoggedIn, authMongoUser } = useAuth();
  const router = useRouter();
  const { getAllIncomes } = useIncomeContext();
  const { getExpenses } = useExpenseContext();
  const insets = useSafeAreaInsets();

useEffect(() => {
    if (!userLoggedIn || !currentUser) return;

    (async () => {
      try {
        await Promise.all([getAllIncomes(), getExpenses()]);
      } catch (err: any) {
        console.error("[home-user] bootstrap fetch failed:", err?.message);
      }
    })();
  }, [userLoggedIn, currentUser, getAllIncomes, getExpenses]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]} >
        {userLoggedIn && currentUser?.email ? (
          <>
            <View style={styles.welcomeCard}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>
                {currentUser?.displayName || currentUser.email.split('@')[0]}
              </Text>
              <Text style={styles.subText}>
                Ready to track your finances?
              </Text>
            </View>

            <Pressable
              style={styles.dashboardBtn}
              onPress={() => router.push('/(tabs)/dashboard')}
            >
              <Text style={styles.btnText}>Go to Dashboard</Text>
            </Pressable>

            <View style={styles.quickActions}>
              <Pressable 
                style={[styles.actionCard, { borderColor: COLORS.green }]}
                onPress={() => router.push('/(tabs)/income')}
              >
                <Text style={styles.actionTitle}>Income</Text>
                <Text style={styles.actionSubtitle}>Track earnings</Text>
              </Pressable>

              <Pressable 
                style={[styles.actionCard, { borderColor: COLORS.red }]}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  welcomeCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
  },
  greeting: {
    color: COLORS.muted,
    fontSize: 16,
    marginBottom: 8,
  },
  userName: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  subText: {
    color: COLORS.muted,
    fontSize: 15,
  },
  dashboardBtn: {
    backgroundColor: COLORS.green,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '800',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.panel2,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 20,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  actionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },
  notLoggedIn: {
    alignItems: 'center',
  },
  notLoggedText: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 24,
  },
  loginBtn: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
  },
});