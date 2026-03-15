// components/common/TransactionCard.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ThemeColors } from '@/constants/Colors';
import { formatMoney } from '@/utils/formatters';
import { getCategoryIcon } from '@/constants/categoryIcons';
import { TransactionBase } from '@/types/dashboard.types';
import { useThemeColors } from '@/hooks/useThemeColors';

type TransactionCardProps = {
  item: TransactionBase;
  timeLabel?: string;
};

export function TransactionCard({ item, timeLabel }: TransactionCardProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isExpense = item.amount < 0 || item.type === 'Expense';
  const accentColor = isExpense ? colors.red : colors.green;
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
    <Pressable onPress={handlePress} style={[styles.card, { borderLeftColor: accentColor }]}>
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: icon.color + '22' }]}>
          <Ionicons name={icon.name as any} size={22} color={icon.color} />
        </View>

        {/* Title + badges */}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: icon.color + '22' }]}>
              <Text style={[styles.badgeText, { color: icon.color }]}>
                {item.category}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: accentColor + '22' }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {item.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <Text style={[styles.amount, { color: accentColor }]}>
          {amountPrefix}{formatMoney(Math.abs(item.amount))}
        </Text>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.date}>{timeLabel ?? ''}</Text>
        {!!item.description && (
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.muted,
    fontSize: 12,
  },
  description: {
    color: colors.muted,
    fontSize: 12,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
