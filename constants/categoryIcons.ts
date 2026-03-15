// constants/categoryIcons.ts
export type CategoryIconConfig = {
  name: string; // Ionicons icon name
  color: string;
};

export const CATEGORY_ICONS: Record<string, CategoryIconConfig> = {
  // ── Income categories ──────────────────────────────────────
  Salary:           { name: 'briefcase-outline',                   color: '#B9FF4D' },
  Freelance:        { name: 'laptop-outline',                      color: '#4FC3F7' },
  Business:         { name: 'business-outline',                    color: '#FFD54F' },
  Investment:       { name: 'trending-up-outline',                 color: '#81C784' },
  Gift:             { name: 'gift-outline',                        color: '#F48FB1' },
  Bonus:            { name: 'star-outline',                        color: '#FFB74D' },
  'Other Income':   { name: 'cash-outline',                        color: '#80CBC4' },

  // ── Expense categories (CategoryPicker values) ─────────────
  'Food & Dining':     { name: 'fast-food-outline',                color: '#FF8A65' },
  Transportation:      { name: 'car-outline',                      color: '#90CAF9' },
  Shopping:            { name: 'cart-outline',                     color: '#CE93D8' },
  Entertainment:       { name: 'game-controller-outline',          color: '#F06292' },
  'Bills & Utilities': { name: 'receipt-outline',                  color: '#FFF176' },
  Healthcare:          { name: 'medkit-outline',                   color: '#EF9A9A' },
  Education:           { name: 'school-outline',                   color: '#80DEEA' },
  Travel:              { name: 'airplane-outline',                 color: '#A5D6A7' },
  Insurance:           { name: 'shield-checkmark-outline',         color: '#B0BEC5' },
  'Other Expense':     { name: 'ellipsis-horizontal-circle-outline', color: '#BCAAA4' },

  // ── Aliases — short DB values that differ from picker labels ─
  // These cover categories entered before the full label was enforced.
  Food:              { name: 'fast-food-outline',                  color: '#FF8A65' },
  Health:            { name: 'medkit-outline',                     color: '#EF9A9A' },
  Transport:         { name: 'car-outline',                        color: '#90CAF9' },
  Bills:             { name: 'receipt-outline',                    color: '#FFF176' },
  Other:             { name: 'ellipsis-horizontal-circle-outline', color: '#BCAAA4' },
};

/**
 * Safe getter — falls back to a generic icon if category is unknown.
 */
export function getCategoryIcon(category: string): CategoryIconConfig {
  return (
    CATEGORY_ICONS[category] ?? {
      name: 'help-circle-outline',
      color: '#A9B3C6',
    }
  );
}
