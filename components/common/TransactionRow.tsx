// components/common/TransactionRow.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { formatMoney } from '@/utils/formatters';
import { getCategoryIcon } from '@/constants/categoryIcons';
import { TransactionBase } from '@/types/dashboard.types';

type TransactionRowProps = {
  item: TransactionBase;
  timeLabel?: string;
};

export function TransactionRow({ item, timeLabel }: TransactionRowProps) {
  const router = useRouter();
  const isExpense = item.amount < 0 || item.type === 'Expense';
  const amountColor = isExpense ? COLORS.red : COLORS.green;
  const amountPrefix = isExpense ? '-' : '+';
  const icon = getCategoryIcon(item.category);

  const handlePress = () => {
    if (item.type === 'Income') {
      router.push(`/(tabs)/income/${item._id}`);
    } else {
      router.push(`/(tabs)/expense/${item._id}`);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.row}>
      {/* Square rounded icon — KOHO style */}
      <View style={[styles.iconSquare, { backgroundColor: icon.color }]}>
        <Ionicons name={icon.name as any} size={20} color="#fff" />
      </View>

      {/* Title + subtitle */}
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {timeLabel ? `${timeLabel} · ` : ''}{item.category}
        </Text>
      </View>

      {/* Amount */}
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix}{formatMoney(Math.abs(item.amount))} $
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
  },
});