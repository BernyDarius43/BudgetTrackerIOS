// app/register.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext/authContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { registerUser, loading, errorMessage, clearErrorMessage } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    clearErrorMessage();
  }, [clearErrorMessage]);

  const canSubmit = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword &&
      !loading
    );
  }, [email, password, confirmPassword, loading]);

  const handleRegisterPress = async () => {
    try {
      await registerUser(email.trim(), password, confirmPassword);
    } catch (error: any) {
      console.log("Registration failed:", error?.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.brand}>BudgetTracker</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Start tracking income and expenses in minutes.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            {!errorMessage && password.length > 0 && confirmPassword.length > 0 && password !== confirmPassword ? (
              <Text style={styles.warn}>Passwords do not match.</Text>
            ) : null}

            <Pressable
              style={[styles.primaryBtn, !canSubmit && styles.btnDisabled]}
              onPress={handleRegisterPress}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator color="#0B0D10" />
              ) : (
                <Text style={styles.primaryBtnText}>Sign Up</Text>
              )}
            </Pressable>

            <Pressable style={styles.linkBtn} onPress={() => router.replace("/login")}>
              <Text style={styles.linkText}>Already have an account? Log in</Text>
            </Pressable>

            <Pressable style={styles.linkBtn} onPress={() => router.replace("/home")}>
              <Text style={styles.mutedLinkText}>Back to home</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0D10" },
  container: { flex: 1, padding: 18, justifyContent: "center", gap: 16 },

  header: { gap: 6 },
  brand: { color: "#B9FF4D", fontWeight: "900", letterSpacing: 1, fontSize: 14 },
  title: { color: "#E9EEF7", fontSize: 26, fontWeight: "900" },
  subtitle: { color: "#A9B3C6", fontSize: 14, lineHeight: 20 },

  card: {
    backgroundColor: "#0F1217",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  label: { color: "#C9D2E3", fontSize: 13, fontWeight: "700" },
  input: {
    backgroundColor: "#12151B",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#E9EEF7",
  },

  error: { color: "#FF6B6B", fontWeight: "700", marginTop: 4 },
  warn: { color: "#FBBF24", fontWeight: "700", marginTop: 4 },

  primaryBtn: {
    marginTop: 6,
    backgroundColor: "#B9FF4D",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: "#0B0D10", fontWeight: "900", fontSize: 16 },

  linkBtn: { paddingVertical: 10, alignItems: "center" },
  linkText: { color: "#E9EEF7", fontWeight: "800" },
  mutedLinkText: { color: "#A9B3C6", fontWeight: "700" },
});
