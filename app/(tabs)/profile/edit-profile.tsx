// app/(tabs)/profile/edit-profile.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext/authContext";
import { type ThemeColors } from "@/constants/Colors";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PRESET_AVATARS } from "@/constants/avatars";
import api from "@/services/api";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SkeletonBlock, SkeletonForm } from "@/components/skeletons";

export default function EditProfileScreen() {
  const { currentUser, updateUserProfile, authMongoUser, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [displayName, setDisplayName] = useState(authMongoUser?.displayName ?? currentUser?.displayName ?? '');
  const [email, setEmail] = useState(authMongoUser?.email ?? currentUser?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(authMongoUser?.phoneNumber ?? '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
  authMongoUser?.photoURL ?? currentUser?.photoURL ?? ''
);

  useEffect(() => {
    // Prefer Mongo as source of truth for profile fields
  setDisplayName(authMongoUser?.displayName ?? currentUser?.displayName ?? "");
  setEmail(authMongoUser?.email ?? currentUser?.email ?? "");
  setSelectedAvatar(authMongoUser?.photoURL ?? currentUser?.photoURL ?? "");
  setPhoneNumber(authMongoUser?.phoneNumber ?? "");
  }, [currentUser, authMongoUser]);

  const canSave = useMemo(() => {
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhoneNumber = phoneNumber.trim();
    return Boolean(trimmedName && trimmedEmail && selectedAvatar && !saving && trimmedPhoneNumber);
  }, [displayName, email, phoneNumber, selectedAvatar, saving]);

  const handleSave = async () => {
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedEmail) {
      Toast.show({
        type: "error",
        text1: "Validation",
        text2: "Both display name and email are required.",
      });
      return;
    }

    if (!currentUser?.uid) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No authenticated user found. Please log in again.",
      });
      return;
    }

    try {
      setSaving(true);
      
    console.log('=== EDIT PROFILE DEBUG ===');
    console.log('Current User UID:', currentUser.uid);
    console.log('Display Name:', trimmedName);
    console.log('Email:', trimmedEmail);
    console.log('Phone:', trimmedPhone);
    console.log('Avatar:', selectedAvatar);
    console.log('==========================');

       await updateUserProfile({
        displayName: trimmedName,
        email: trimmedEmail,
        photoURL: selectedAvatar,
        phoneNumber: trimmedPhone,
        uid: currentUser?.uid,
      });
/* 
      console.log('=== UPDATE PROFILE RESPONSE ===');
      console.log('Response status:', res);
      console.log('Response data:', (res as any)?.data);
      console.log('Full response:', JSON.stringify(res, null, 2));
      console.log('===========================');

      if (!((res as any)?.status === 200)) {
        Toast.show({
          type: "error mongo",
          text1: "Update failed",
          text2: "An error occurred while sending your profile to the server.",
        });
      } */
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully.",
      });
      setTimeout(() => {
      router.replace("/(tabs)/profile");
    }, 500);
    } catch (error: any) {
      // Firebase email update can fail with "requires-recent-login"
      // ✅ DETAILED ERROR LOGGING
    console.error('=== UPDATE PROFILE ERROR ===');
    console.error('Error object:', error);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    console.error('Response status:', error?.response?.status);
    console.error('Response data:', error?.response?.data);
    console.error('Full response:', JSON.stringify(error?.response, null, 2));
    console.error('===========================');

    // Show the actual error to user
    const errorDetails = error?.response?.data?.error 
      || error?.response?.data?.detail 
      || error?.message 
      || "Unknown error";

    Toast.show({
      type: "error",
      text1: "Update failed",
      text2: errorDetails,
    });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading && !authMongoUser) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.loaderContainer}>
          <View style={styles.skeletonShell}>
            <View style={styles.avatarGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} width={56} height={56} borderRadius={28} />
              ))}
            </View>
            <SkeletonBlock width={140} height={22} borderRadius={8} />
            <SkeletonForm fieldCount={3} buttonCount={2} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>

              {/* Avatar picker */}
      <View style={styles.avatarGrid}>
  {PRESET_AVATARS.map((avatar) => (
    <Pressable
      key={avatar.id}
      onPress={() => setSelectedAvatar(avatar.uri)}
      style={[
        styles.avatarWrapper,
        selectedAvatar === avatar.uri && styles.avatarSelected,
      ]}
    >
      <Image source={{ uri: avatar.uri }} style={styles.avatar} />
    </Pressable>
  ))}
</View>

        <Text style={styles.title}>Edit Profile</Text>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Your phone number"
          keyboardType="phone-pad"
          placeholderTextColor={colors.muted}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Pressable
          style={[styles.button, !canSave && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          {saving ? (
            <SkeletonBlock width={92} height={14} borderRadius={6} />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 18 },
  skeletonShell: { width: '100%', gap: 14 },

  container: { flex: 1, padding: 18, gap: 10 },
  title: { color: colors.text, fontSize: 22, fontWeight: "900", marginBottom: 8 },

  sectionTitle: {
    color: colors.muted,
    marginTop: 4,
    marginBottom: 10,
    fontWeight: "700",
  },

  avatarGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.10)",
  },
  avatarSelected: {
    borderColor: colors.green,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  label: { color: colors.muted, fontSize: 13, fontWeight: "700", marginTop: 8 },
  input: {
    backgroundColor: colors.panel2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },

  button: {
    backgroundColor: colors.green,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.bg, fontSize: 16, fontWeight: "900" },

  secondaryBtn: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: "800" },
});
