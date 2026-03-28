export interface ReceiptItem {
  name: string;
  price: number;
}

export interface Receipt {
  id: number;
  store: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  categories: string[];
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export type InsightType = "distribution" | "trend" | "top-item" | "impulse" | "category-high";

export interface Insight {
  icon: string;
  text: string;
  highlightedText: { before: string; value: string; after: string };
  trend: "up" | "down" | "neutral";
  type: InsightType;
}
