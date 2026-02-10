// components/modals/QuickAddModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function QuickAddModal({ visible, onClose }: Props) {
  const router = useRouter();

  const handleAddIncome = () => {
    onClose();
    // Small delay so modal closes smoothly before navigation
    setTimeout(() => {
      router.push("/(tabs)/income/add");
    }, 150);
  };

  const handleAddExpense = () => {
    onClose();
    setTimeout(() => {
      router.push("/(tabs)/expense/add");
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Add Transaction</Text>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.muted} />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>
                Choose what type of transaction you want to add
              </Text>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <Pressable
                  onPress={handleAddIncome}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.incomeButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>💰</Text>
                  </View>
                  <Text style={styles.actionTitle}>Add Income</Text>
                  <Text style={styles.actionSubtitle}>
                    Track your earnings
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleAddExpense}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.expenseButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>💸</Text>
                  </View>
                  <Text style={styles.actionTitle}>Add Expense</Text>
                  <Text style={styles.actionSubtitle}>
                    Monitor spending
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: COLORS.panel,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 24,
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  incomeButton: {
    backgroundColor: COLORS.pillBg,
    borderColor: COLORS.green,
  },
  expenseButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: COLORS.red,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.panel2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconText: {
    fontSize: 28,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },
});