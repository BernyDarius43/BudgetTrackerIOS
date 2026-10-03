import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormErrorRenderer } from "@/components/forms/FormErrorRenderer";
import { useFormError } from "@/hooks/useFormError";
import { useAuth } from "@/context/authContext/authContext";
import { useRouter } from "expo-router";
type Props = {
  mode: "login" | "register";
};

export const AuthForm = ({ mode }: Props) => {
  const { loginUser, registerUser, error, clearError, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();


  const { isInvalid } = useFormError(error);

  const handleSubmit = async () => {
    clearError();

    if (mode === "login") {
      await loginUser(email, password);
    } else {
      await registerUser(email, password, confirmPassword);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.brand}>BudgetTracker</Text>
          <Text style={styles.headline}>
            {mode === "login" ? "Welcome back." : "Create your account."}
          </Text>
          <Text style={styles.subheadline}>
            {mode === "login"
              ? "Log in to continue tracking your finances."
              : "Start tracking your income and expenses."}
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <FormErrorRenderer error={error} global />

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (error) clearError();
            }}
            style={[styles.input, isInvalid("email") && styles.inputError]}
          />
          <FormErrorRenderer error={error} field="email" />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (error) clearError();
            }}
            style={[styles.input, isInvalid("password") && styles.inputError]}
          />
          <FormErrorRenderer error={error} field="password" />

          {/* REGISTER ONLY */}
          {mode === "register" && (
            <>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(t) => {
                  setConfirmPassword(t);
                  if (error) clearError();
                }}
                style={[
                  styles.input,
                  isInvalid("confirmPassword") && styles.inputError,
                ]}
              />
              <FormErrorRenderer error={error} field="confirmPassword" />
            </>
          )}

          {/* PRIMARY BUTTON */}
          <Pressable
            style={styles.primaryBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {mode === "login" ? "Login" : "Create account"}
            </Text>
          </Pressable>

          {/* SECONDARY ACTION */}
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              clearError();
              router.replace(mode === "login" ? "/register" : "/login");
            }}
          >
            <Text style={styles.secondaryBtnText}>
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0D10" },

  container: {
    flex: 1,
    padding: 18,
    gap: 16,
    justifyContent: "center",
  },

  hero: { gap: 10 },
  brand: {
    color: "#B9FF4D",
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 14,
  },
  headline: {
    color: "#E9EEF7",
    fontSize: 26,
    fontWeight: "900",
  },
  subheadline: {
    color: "#A9B3C6",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#0F1217",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },

  input: {
    backgroundColor: "#12151B",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: "#E9EEF7",
  },

  inputError: {
    borderColor: "#FF6B6B",
  },

  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#B9FF4D",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  primaryBtnText: {
    color: "#0B0D10",
    fontWeight: "900",
    fontSize: 16,
  },

  secondaryBtn: {
    backgroundColor: "#12151B",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryBtnText: {
    color: "#E9EEF7",
    fontWeight: "800",
    fontSize: 15,
  },
});