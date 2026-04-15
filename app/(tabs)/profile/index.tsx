// app/(tabs)/profile/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, Modal } from 'react-native';
import { useAuth } from '@/context/authContext/authContext';
import { useRouter } from 'expo-router';
import { type ThemeColors } from '@/constants/Colors';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/useThemeColors';
import { SkeletonBlock, SkeletonCard } from '@/components/skeletons';

export default function ProfileScreen() {
  const {
    currentUser,
    authMongoUser,
    logoutUser,
    loading,
    themePreference,
    resolvedTheme,
    setThemePreference,
  } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);

  const themeLabel = useMemo(() => {
    if (themePreference === 'system') {
      return `System (${resolvedTheme[0].toUpperCase()}${resolvedTheme.slice(1)})`;
    }
    return themePreference[0].toUpperCase() + themePreference.slice(1);
  }, [themePreference, resolvedTheme]);

  if (loading && !authMongoUser) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={[styles.safe]}>
          <ScrollView
            contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <SkeletonBlock width={90} height={30} borderRadius={10} />
            </View>

            <View style={styles.profileCard}>
              <SkeletonBlock width={80} height={80} borderRadius={40} />
              <SkeletonBlock width={160} height={24} borderRadius={10} style={{ marginTop: 16 }} />
              <SkeletonBlock width={200} height={14} borderRadius={6} style={{ marginTop: 10 }} />
              <SkeletonBlock width={92} height={26} borderRadius={999} style={{ marginTop: 14 }} />
            </View>

            <View style={styles.section}>
              <SkeletonBlock width={180} height={16} borderRadius={6} style={{ marginBottom: 12 }} />
              <SkeletonCard />
            </View>

            <View style={styles.section}>
              <SkeletonBlock width={140} height={16} borderRadius={6} style={{ marginBottom: 12 }} />
              <SkeletonCard />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

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
        {authMongoUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.infoPanel}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Currency</Text>
                <Text style={styles.infoValue}>
                  {authMongoUser.preferences?.currency || 'CAD'}
                </Text>
              </View>

              <View style={styles.divider} />

              <Pressable style={styles.infoRow} onPress={() => setThemeSheetOpen(true)}>
                <Text style={styles.infoLabel}>Theme</Text>
                <Text style={styles.infoValue}>
                  {themeLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
        <Pressable 
  style={[styles.actionButton, styles.dangerButton]}
  onPress={handleLogout}
  disabled={loading}
>
  {loading ? (
    <SkeletonBlock width={92} height={14} borderRadius={6} />
  ) : (
    <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
      Logout
    </Text>
  )}
</Pressable>
        </View>

        {/* Theme Sheet */}
        <Modal
          visible={themeSheetOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setThemeSheetOpen(false)}
        >
          <Pressable style={styles.sheetOverlay} onPress={() => setThemeSheetOpen(false)}>
            <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Theme</Text>

              {(['system', 'light', 'dark'] as const).map((option) => {
                const label =
                  option === 'system'
                    ? `System (${resolvedTheme[0].toUpperCase()}${resolvedTheme.slice(1)})`
                    : option[0].toUpperCase() + option.slice(1);
                const isSelected = themePreference === option;

                return (
                  <Pressable
                    key={option}
                    style={styles.sheetOption}
                    onPress={async () => {
                      await setThemePreference(option);
                      setThemeSheetOpen(false);
                    }}
                  >
                    <Text style={[styles.sheetOptionText, isSelected && styles.sheetOptionTextActive]}>
                      {label}
                    </Text>
                    {isSelected && <Text style={styles.sheetCheck}>✓</Text>}
                  </Pressable>
                );
              })}

              <Pressable style={styles.sheetCancel} onPress={() => setThemeSheetOpen(false)}>
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: 18,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: colors.bg,
    fontSize: 32,
    fontWeight: '800',
  },
  displayName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.pillBg,
    borderColor: colors.pillBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  roleText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  infoPanel: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
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
    color: colors.muted,
    fontSize: 14,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 4,
  },
  actionButton: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  dangerButton: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  dangerButtonText: {
    color: colors.white,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  appInfoText: {
    color: colors.muted,
    fontSize: 12,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 4,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sheetOptionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetOptionTextActive: {
    color: colors.green,
    fontWeight: '800',
  },
  sheetCheck: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '800',
  },
  sheetCancel: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sheetCancelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
