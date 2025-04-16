// pages/LoginPage.js (converted for React Native)
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useAuth } from '../context/authContext/authContext';
import { loginUser } from '@/services/authService';
import { useRouter  } from 'expo-router';

const LoginPage = () => {
  const {loginUser, loading,userLoggedIn, setAuthMongoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const router = useRouter();
  
  const handleLoginPress = () => {
    loginUser(email, password);  // triggers AuthProvider's login, which manages loading internally
  };

  // If already logged in, navigate to the protected home screen
  useEffect(() => {
    if (userLoggedIn) {
      router.replace('/(tabs)/home-user');
    }
  }, [userLoggedIn]);
  

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

<TouchableOpacity 
  style={styles.button}
  onPress={handleLoginPress}
  disabled={isSigningIn}
>
  {isSigningIn ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Sign In</Text>
  )}
</TouchableOpacity>

        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
        onPress={() => {
          handleLogin();
        }}>
        Sign In
      </Text>
        </View> */}
        {/* <Button title='Login' style={styles.button} onPress={handleLogin} disabled={isSigningIn}>
          {isSigningIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Button> */}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  form: { width: '100%' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  error: { color: 'red', marginTop: 8 },
});

export default LoginPage;
