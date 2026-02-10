// app/+not-found.tsx
import React from "react";
import { Stack, Link } from "expo-router";
import { StyleSheet, View, Text, SafeAreaView, Pressable } from "react-native";
import { useAuth } from "@/context/authContext/authContext";

export default function NotFoundScreen() {
  const { userLoggedIn } = useAuth();
  const targetRoute = userLoggedIn ? "/(auth)/home-user" : "/home";

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ title: "Not found" }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>This screen doesn’t exist</Text>
        <Text style={styles.subtitle}>
          The route you tried to open isn’t available. Use the button below to get back on track.
        </Text>

        <Link href={targetRoute} asChild>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Go to home</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0D10" },
  container: { flex: 1, justifyContent: "center", padding: 18, gap: 10 },
  code: { color: "#B9FF4D", fontSize: 44, fontWeight: "900" },
  title: { color: "#E9EEF7", fontSize: 20, fontWeight: "900" },
  subtitle: { color: "#A9B3C6", fontSize: 14, lineHeight: 20 },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: "#B9FF4D",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  primaryBtnText: { color: "#0B0D10", fontWeight: "900", fontSize: 16 },
});
