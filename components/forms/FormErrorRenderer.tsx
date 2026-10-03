// components/forms/FormErrorRenderer.tsx
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { AuthError } from "@/utils/AuthErrors";

type Props = {
  error: AuthError | null;
  field?: AuthError["field"];
  global?: boolean;
};

export const FormErrorRenderer = ({ error, field, global }: Props) => {
  if (!error) return null;

  // GLOBAL ERROR
  if (global) {
    if (error.field !== "general") return null;

    return (
      <View style={styles.globalBox}>
        <Text style={styles.globalText}>{error.message}</Text>
      </View>
    );
  }

  // FIELD ERROR
  if (!field) return null;
  if (error.field !== field) return null;

  return <Text style={styles.inlineText}>{error.message}</Text>;
};

const styles = StyleSheet.create({
  inlineText: {
    color: "#FF6B6B",
    fontWeight: "700",
    marginTop: 6,
    fontSize: 13,
  },
  globalBox: {
    backgroundColor: "#1A0F10",
    borderColor: "#3A1F22",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  globalText: {
    color: "#FF6B6B",
    fontWeight: "700",
    textAlign: "center",
  },
});