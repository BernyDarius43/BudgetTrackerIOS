// app/(tabs)/home-user/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { useRouter } from 'expo-router';

const HomePageUser = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {userLoggedIn && currentUser?.email ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {currentUser.email}!</Text>
          <Text style={styles.subText}>We are glad to see you back.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.navigate('/(tabs)/dashboard')}
          >
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.subText}>You are not logged in.</Text>
      )}
    </View>
  );
};

export default HomePageUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
