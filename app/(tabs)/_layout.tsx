// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { GlobalProvider } from '@/context/GlobalContext';
import Ionicons from '@expo/vector-icons/Ionicons';

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
        tabBarActiveTintColor: '#ffd33d', // Customize as needed (or pull from your Colors)
        // Optional: Customize tabBarStyle, tabBarBackground, etc.
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
        backgroundColor: '#25292e',
        },
      }}
    >
      <Tabs.Screen 
      name="dashboard" 
      options={{ 
        title: 'Dashboard' ,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
        }} />
      <Tabs.Screen name="income" options={{ title: 'Income' }} />
      <Tabs.Screen name="expense" options={{ title: 'Expense' }} />
      <Tabs.Screen 
      name="profile" 
      options={{ title: 'Profile', 
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
        ),
      }} />
      <Tabs.Screen 
      name="home-user" 
      options={{ title: 'Home',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
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
