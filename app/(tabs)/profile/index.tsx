import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext/authContext';
import ParallaxScrollView from '@/components/ParallaxScrollView';

const ProfileScreen = () => {
  const { currentUser, userLoggedIn } = useAuth();
  const router = useRouter();

  if (!userLoggedIn || !currentUser) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#f0f0f0', dark: '#1a1a1a' }} headerImage={<></>}>
      <View style={styles.contentContainer}>
        <Text className="title">Your Profile</Text>
        <Text className="subtitle">Display Name</Text>
        <Text>{currentUser.displayName || 'No name set'}</Text>

        <Text className="subtitle" style={styles.sectionMargin}>Email</Text>
        <Text>{currentUser.email}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/(tabs)/profile/edit-profile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  sectionMargin: {
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
