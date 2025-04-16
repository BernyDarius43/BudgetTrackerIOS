// components/NavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext/authContext';
import { signOutUser } from '../firebase/auth';

const NavBar = () => {
  const navigation = useNavigation();
  const { userLoggedIn, setCurrentUser, setAuthMongoUser } = useAuth();

  const logout = async () => {
    try {
      if (userLoggedIn) {
        await signOutUser();
        setCurrentUser(null);
        setAuthMongoUser(null);
        // Remove stored tokens using AsyncStorage if needed
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = () => {
    navigation.navigate('Login');
  };

  const register = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.brand}>
        <Text style={styles.brandText}>BudgetTracker</Text>
      </View>
      <View style={styles.navItems}>
        <TouchableOpacity onPress={() => navigation.navigate(userLoggedIn ? 'Homepage' : 'Home')}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        {userLoggedIn && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.navItem}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Income')}>
              <Text style={styles.navItem}>Incomes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Expense')}>
              <Text style={styles.navItem}>Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.navItem}>Your profile</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.navItem}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.navItem}>Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.authSection}>
        {userLoggedIn ? (
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.authButtons}>
            <TouchableOpacity onPress={register} style={styles.signupButton}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={login} style={styles.loginButton}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#00D1B2',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  brand: {
    flex: 1,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  navItems: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    color: '#fff',
    fontSize: 16,
  },
  authSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  authButtons: {
    flexDirection: 'row',
  },
  signupButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 5,
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
  }
});

export default NavBar;
