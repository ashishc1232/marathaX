// ── MARATHAX Category Configuration ──
// Single source of truth for fees, prizes, and category metadata.
// This file is imported by the register page, ArenaPass, and the API handler.

export interface CategoryInfo {
  label: string;
  group: 'open' | 'doubles' | 'rising';
  fee: number;           // in ₹
  prizes: string[];      // ordered 1st → last
}

export const CATEGORY_CONFIG: Record<string, CategoryInfo> = {
  'Male Open (16–29)': {
    label: 'Male Open (16–29)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Male Open (30–45)': {
    label: 'Male Open (30–45)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Male Open (46–55)': {
    label: 'Male Open (46–55)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Female Open (16–29)': {
    label: 'Female Open (16–29)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Female Open (30–45)': {
    label: 'Female Open (30–45)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Female Open (46–55)': {
    label: 'Female Open (46–55)',
    group: 'open',
    fee: 1799,
    prizes: ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  },
  'Male Doubles (18–55)': {
    label: 'Male Doubles (18–55)',
    group: 'doubles',
    fee: 2799,
    prizes: ['₹10,000', '₹5,000', '₹3,000'],
  },
  'Female Doubles (18–55)': {
    label: 'Female Doubles (18–55)',
    group: 'doubles',
    fee: 2799,
    prizes: ['₹10,000', '₹5,000', '₹3,000'],
  },
  'Mixed Doubles (18–55)': {
    label: 'Mixed Doubles (18–55)',
    group: 'doubles',
    fee: 2799,
    prizes: ['₹10,000', '₹5,000', '₹3,000'],
  },
  'Rising Star (8–15)': {
    label: 'Rising Star (8–15)',
    group: 'rising',
    fee: 1799,
    prizes: ['Running Shoes', 'Fitness Watch'],
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG);

export function getCategoryInfo(category: string): CategoryInfo | null {
  return CATEGORY_CONFIG[category] ?? null;
}

export const PRIZE_LABELS = ['1st Place', '2nd Place', '3rd Place', '4th Place', '5th Place'];
