// components/common/TransactionRow.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { formatMoney } from '@/utils/formatters';
import { TransactionBase } from '@/types/dashboard.types';

type TransactionRowProps = {
  item: TransactionBase;
  timeLabel?: string;
};

export function TransactionRow({ item, timeLabel }: TransactionRowProps) {
  const router = useRouter();
  const isExpense = item.amount < 0 || item.type === 'Expense';
  const amountColor = isExpense ? COLORS.text : COLORS.green;

  const handlePress = () => {
    if (item.type === 'Income') {
      router.push(`/(tabs)/income/${item._id}`);
    } else {
      router.push(`/(tabs)/expense/${item._id}`);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.txRow}>
      <View style={styles.txIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.txTitle}>{item.title}</Text>
        <Text style={styles.txSub}>
          {item.category} {timeLabel ? `• ${timeLabel}` : ''}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color: amountColor }]}>
        {formatMoney(isExpense ? -Math.abs(item.amount) : item.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.txBorder,
  },
  txIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    marginRight: 12,
  },
  txTitle: { 
    color: COLORS.text, 
    fontWeight: '800',
    fontSize: 15,
  },
  txSub: { 
    color: COLORS.muted, 
    fontSize: 12, 
    marginTop: 2,
  },
  txAmount: { 
    fontWeight: '900',
    fontSize: 16,
  },
});