// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { GlobalProvider } from '@/context/GlobalContext';

export default function TabsLayout() {
  const { userLoggedIn } = useAuth();

  // If not authenticated, redirect to the login screen.
  if (!userLoggedIn) {
    return <Redirect href="/login" />;
  }

  // Authenticated users see the tab navigator.
  return (
    <GlobalProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6', // Customize as needed (or pull from your Colors)
        // Optional: Customize tabBarStyle, tabBarBackground, etc.
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="income" options={{ title: 'Income' }} />
      <Tabs.Screen name="expense" options={{ title: 'Expense' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="home-user" options={{ title: 'Home' }} />
    </Tabs>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
