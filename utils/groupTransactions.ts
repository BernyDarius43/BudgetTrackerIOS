// utils/groupTransactions.ts
import { MergedTransaction } from '@/hooks/useAllTransactions';

export type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All';

export type TransactionSection = {
  title: string;       // e.g. "March 2026"
  data: MergedTransaction[];
};

/**
 * Returns the earliest date allowed for the given TimeRange.
 *
 * ✅ 1M = start of the CURRENT calendar month (e.g. March 1, 2026)
 *         NOT "30 days ago" — matches the chart's monthly grouping logic.
 * ✅ 3M/6M/1Y = subtract months from today's date.
 * ✅ All = no cutoff.
 */
function getRangeCutoff(range: TimeRange): Date | null {
  if (range === 'All') return null;

  const now = new Date();

  if (range === '1M') {
    // First day of the current calendar month at midnight
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const cutoff = new Date(now);

  switch (range) {
    case '3M': cutoff.setMonth(now.getMonth() - 3); break;
    case '6M': cutoff.setMonth(now.getMonth() - 6); break;
    case '1Y': cutoff.setFullYear(now.getFullYear() - 1); break;
  }

  return cutoff;
}

/**
 * Formats a Date into a section header label: "March 2026"
 */
function toSectionTitle(date: Date): string {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

/**
 * Transforms a flat sorted MergedTransaction[] into SectionList-ready sections,
 * filtered by TimeRange and grouped under month-year headers.
 *
 * Filters and groups by tx.date (user-set transaction date),
 * NOT tx.createdAt (MongoDB insertion timestamp).
 */
export function groupTransactions(
  transactions: MergedTransaction[],
  range: TimeRange
): TransactionSection[] {
  const cutoff = getRangeCutoff(range);

  // Filter by transaction date
  const filtered = cutoff
    ? transactions.filter(
        (tx) => new Date(tx.date).getTime() >= cutoff.getTime()
      )
    : transactions;

  // Group into a map keyed by "Month Year"
  const groupMap = new Map<string, MergedTransaction[]>();

  filtered.forEach((tx) => {
    const key = toSectionTitle(new Date(tx.date));
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(tx);
  });

  // Convert map to SectionList sections array
  return Array.from(groupMap.entries()).map(([title, data]) => ({
    title,
    data,
  }));
}