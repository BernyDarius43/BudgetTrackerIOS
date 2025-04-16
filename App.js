// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext/authContext';
import { GlobalProvider } from './context/GlobalContext';
import MainNavigator from './app/MainNavigator'; // your app's navigator

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </GlobalProvider>
    </AuthProvider>
  );
}
