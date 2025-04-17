// app/(tabs)/home/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { useRouter } from 'expo-router';

const HomePage: React.FC = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const router = useRouter();

  const handleRegister = () => {
    router.replace('/register');
    console.log("handleRegister is called");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome to your Budget Tracker!</Text>
      </View>

      <View style={styles.containerInner}>
        <Text style={styles.title}>BudgetTracker</Text>
        <Text style={styles.subtitle}>Your Personal Finance Assistant</Text>

        <Text style={styles.paragraph}>
          Are you struggling to manage your finances? Do you often wonder where your money goes each month? 
          Introducing BudgetTracker, your personal finance assistant that makes managing your money simple and stress-free!
        </Text>

        {!userLoggedIn && (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>
              Sign up now and take control of your financial future!
            </Text>
          </TouchableOpacity>
        )}

        {userLoggedIn && currentUser && (
          <Text style={styles.loggedInMessage}>
            Hello {currentUser.displayName || currentUser.email}, you are now logged in.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  content: {
    marginBottom: 20,
  },
  containerInner: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  loggedInMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
