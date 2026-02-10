// app/(tabs)/_layout.tsx
import { DashboardOutline, DashboardSolid } from "@/components/icons/DashboardIcons";
import { MoneyOutline, MoneySolid } from "@/components/icons/MoneyIcons";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { QuickAddModal } from "@/components/modals/QuickAddModal";
import { useAuth } from "@/context/authContext/authContext";


function CenterAddButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const onPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // no-op if haptics unavailable
    }
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.centerButtonWrap}>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
          hitSlop={12}
          style={({ pressed }) => [
            styles.centerButton,
            pressed && styles.centerButtonPressed,
          ]}
        >
          <Ionicons name="add" size={28} color={COLORS.panel} />
        </Pressable>
      </View>

      <QuickAddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
const { currentUser, authMongoUser } = useAuth();
const avatarUri =
  authMongoUser?.photoURL || currentUser?.photoURL || undefined;
  const baseHeight = Platform.OS === "ios" ? 56 : 60;
  const tabBarHeight = baseHeight + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.muted,

        tabBarStyle: {
          backgroundColor: COLORS.panel,
          borderTopColor: COLORS.line,
          borderTopWidth: 1,

          height: tabBarHeight,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color }) =>
  focused ? (
    <DashboardSolid size={24} color={color} />
  ) : (
    <DashboardOutline size={24} color={color} />
  ),
        }}
      />

      <Tabs.Screen
        name="income"
        options={{
          title: "Incomes",
          tabBarIcon: ({ focused, color }) =>
  focused ? (
    <MoneySolid size={24} color={color} />
  ) : (
    <MoneyOutline size={24} color={color} />
  ),
        }}
      />

      {/* Center Action Button */}
      <Tabs.Screen
        name="quick-add"
        options={{
          title: "",
          tabBarShowLabel: false,
          tabBarButton: () => <CenterAddButton />,
        }}
      />

      <Tabs.Screen
        name="expense"
        options={{
          title: "Expenses",
          tabBarIcon: ({ focused, color }) =>
  focused ? (
    <MoneySolid size={24} color={color} />
  ) : (
    <MoneyOutline size={24} color={color} />
  ),

        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
  <View
    style={{
      borderRadius: 999,
      padding: 2,
      borderWidth: focused ? 2 : 0,
      borderColor: focused ? COLORS.green : "transparent",
    }}
  >
    <Image
  source={avatarUri ? { uri: avatarUri } : undefined}
  style={{ width: 24, height: 24, borderRadius: 12 }}
/>
  </View>
),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButtonWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 72,
    boxShadow: "none",
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -14 }],
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  centerButtonPressed: {
    transform: [{ translateY: -14 }, { scale: 0.98 }],
    shadowOpacity: 0.18,
    elevation: 6,
  },
});