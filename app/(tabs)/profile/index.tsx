// app/(tabs)/profile/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '@/services/firebase/firebaseConfig';

export default function ProfileScreen() {
  const { currentUser, authMongoUser, logoutUser, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/login');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
    <View style={[styles.safe]}>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
{/*             <Text style={styles.avatarText}>
              {(authMongoUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </Text> */}
            <Image source={{ uri: authMongoUser?.photoURL || currentUser?.photoURL }} style={styles.avatar} />
          </View>
          <Text style={styles.displayName}>
            {authMongoUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
          
          {authMongoUser?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{authMongoUser.role}</Text>
            </View>
          )}
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoPanel}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {authMongoUser?.uid || 'N/A'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{currentUser?.email || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{authMongoUser?.phoneNumber || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {authMongoUser?.createdAt 
                  ? new Date(authMongoUser.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Login</Text>
              <Text style={styles.infoValue}>
                {authMongoUser?.lastLogin 
                  ? new Date(authMongoUser.lastLogin).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        {authMongoUser?.preferences && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.infoPanel}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Currency</Text>
                <Text style={styles.infoValue}>
                  {authMongoUser.preferences.currency || 'CAD'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Theme</Text>
                <Text style={styles.infoValue}>
                  {authMongoUser.preferences.theme || 'Dark'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/profile/edit-profile")}
          >
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleLogout}
            disabled={loading}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              {loading ? 'Logging out...' : 'Logout'}
            </Text>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>BudgetTracker v1.0.0</Text>
          <Text style={styles.appInfoText}>Made by Berny Darius</Text>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>
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
    padding: 18,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: COLORS.bg,
    fontSize: 32,
    fontWeight: '800',
  },
  displayName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: COLORS.pillBg,
    borderColor: COLORS.pillBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  roleText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoPanel: {
    backgroundColor: COLORS.panel2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 14,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 4,
  },
  actionButton: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  dangerButton: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  dangerButtonText: {
    color: COLORS.white,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  appInfoText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});