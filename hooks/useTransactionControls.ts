// hooks/useTransactionControls.ts
import { useMemo, useState } from 'react';
import { SortOption } from '@/components/common/SortSheet';
import { FilterState, EMPTY_FILTER } from '@/components/common/FilterSheet';

/**
 * Shared hook that handles sort + filter state and logic
 * for any flat array of transactions.
 *
 * Works with Income[], Expense[], or MergedTransaction[].
 */
export function useTransactionControls<T extends {
  date: string;
  amount: number;
  category: string;
}>(items: T[]) {
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const processed = useMemo(() => {
    let result = [...items];

    // ── Apply filters ──────────────────────────────────────
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter((tx) => new Date(tx.date).getTime() >= from);
    }

    if (filters.dateTo) {
      // Include the full "to" day by moving to end of day
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((tx) => new Date(tx.date).getTime() <= to.getTime());
    }

    if (filters.amountMin) {
      const min = parseFloat(filters.amountMin);
      if (!isNaN(min)) {
        result = result.filter((tx) => Math.abs(tx.amount) >= min);
      }
    }

    if (filters.amountMax) {
      const max = parseFloat(filters.amountMax);
      if (!isNaN(max)) {
        result = result.filter((tx) => Math.abs(tx.amount) <= max);
      }
    }

    if (filters.category) {
      result = result.filter((tx) => tx.category === filters.category);
    }

    // ── Apply sort ─────────────────────────────────────────
    result.sort((a, b) => {
      switch (sortOption) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount_asc':
          return Math.abs(a.amount) - Math.abs(b.amount);
        default:
          return 0;
      }
    });

    return result;
  }, [items, sortOption, filters]);

  /**
   * Groups the processed list by date for KOHO-style date headers.
   * Returns [dateLabel, items][] sorted by the current sort order.
   */
  const grouped = useMemo(() => {
    const map = new Map<string, T[]>();

    processed.forEach((item) => {
      const key = new Date(item.date)
        .toLocaleDateString('default', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        .toUpperCase();

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });

    return Array.from(map.entries());
  }, [processed]);

  return {
    processed,
    grouped,
    sortOption,
    setSortOption,
    filters,
    setFilters,
    sortSheetOpen,
    setSortSheetOpen,
    filterSheetOpen,
    setFilterSheetOpen,
  };
}