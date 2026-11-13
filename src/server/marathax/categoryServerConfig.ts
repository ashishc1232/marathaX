// Server-side only — fee + prize map used by API handlers
// Never import this in frontend code

const FEE_MAP: Record<string, number> = {
  'Male Open (16–29)': 1799,
  'Male Open (30–45)': 1799,
  'Male Open (46–55)': 1799,
  'Female Open (16–29)': 1799,
  'Female Open (30–45)': 1799,
  'Female Open (46–55)': 1799,
  'Male Doubles (18–55)': 2799,
  'Female Doubles (18–55)': 2799,
  'Mixed Doubles (18–55)': 2799,
  'Rising Star (8–15)': 1799,
};

const PRIZE_MAP: Record<string, string[]> = {
  'Male Open (16–29)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Male Open (30–45)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Male Open (46–55)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Female Open (16–29)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Female Open (30–45)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Female Open (46–55)': ['₹15,000', '₹10,000', '₹5,000', 'Running Shoes', 'Smart Watch'],
  'Male Doubles (18–55)': ['₹10,000', '₹5,000', '₹3,000'],
  'Female Doubles (18–55)': ['₹10,000', '₹5,000', '₹3,000'],
  'Mixed Doubles (18–55)': ['₹10,000', '₹5,000', '₹3,000'],
  'Rising Star (8–15)': ['Running Shoes', 'Fitness Watch'],
};

export function getCategoryFee(category: string): number | null {
  return FEE_MAP[category] ?? null;
}

export function getCategoryPrizes(category: string): string[] | null {
  return PRIZE_MAP[category] ?? null;
}
