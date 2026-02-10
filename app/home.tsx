// app/home.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext/authContext";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomePage() {
  const router = useRouter();
  const { userLoggedIn, currentUser } = useAuth();
  const insets = useSafeAreaInsets();

  // If already logged in, you can choose to show a CTA to go to app
  const primaryAction = () => {
    if (userLoggedIn) router.replace("/(auth)/home-user");
    else router.replace("/register");
  };

  const secondaryAction = () => {
    if (userLoggedIn) router.replace("/(auth)/home-user");
    else router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.brand}>BudgetTracker</Text>
          <Text style={styles.headline}>Know where your money goes.</Text>
          <Text style={styles.subheadline}>
            Track income and expenses, see your balance trend, and stay in control with a simple dashboard.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What you get</Text>

          <View style={styles.featureRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.featureText}>Fast income & expense logging</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.featureText}>Personal dashboard with recent activity</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.featureText}>Secure account using Firebase + MongoDB</Text>
          </View>

          {userLoggedIn && (
            <View style={styles.loggedInBanner}>
              <Text style={styles.loggedInText}>
                Signed in as {currentUser?.displayName || currentUser?.email}
              </Text>
            </View>
          )}

          <Pressable style={styles.primaryBtn} onPress={primaryAction}>
            <Text style={styles.primaryBtnText}>
              {userLoggedIn ? "Go to dashboard" : "Create an account"}
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={secondaryAction}>
            <Text style={styles.secondaryBtnText}>
              {userLoggedIn ? "Open app" : "I already have an account"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0D10" },
  container: { padding: 18, gap: 16 },
  hero: { gap: 10, marginTop: 8 },
  brand: { color: "#B9FF4D", fontWeight: "900", letterSpacing: 1, fontSize: 14 },
  headline: { color: "#E9EEF7", fontSize: 28, fontWeight: "900", lineHeight: 34 },
  subheadline: { color: "#A9B3C6", fontSize: 14, lineHeight: 20 },

  card: {
    backgroundColor: "#0F1217",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardTitle: { color: "#E9EEF7", fontSize: 16, fontWeight: "800", marginBottom: 6 },

  featureRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bullet: { color: "#B9FF4D", fontSize: 18, lineHeight: 20, marginTop: 1 },
  featureText: { color: "#C9D2E3", fontSize: 14, lineHeight: 20, flex: 1 },

  loggedInBanner: {
    marginTop: 6,
    backgroundColor: "#12151B",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  loggedInText: { color: "#A9B3C6", fontSize: 13 },

  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#B9FF4D",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#0B0D10", fontWeight: "900", fontSize: 16 },

  secondaryBtn: {
    backgroundColor: "#12151B",
    borderColor: "#1E2430",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#E9EEF7", fontWeight: "800", fontSize: 15 },

  footerSpacer: { height: 22 },
});
