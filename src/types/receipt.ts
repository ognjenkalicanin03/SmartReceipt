export interface ReceiptItem {
  name: string;
  price: number;
  category?: string;
}

export interface Receipt {
  id: string;
  store: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  categories: string[];
  image_url?: string | null;
  created_at?: string;
  is_manual?: boolean;
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export type InsightType = "distribution" | "top-item" | "category-high" | "prediction" | "spending-alert";

export interface Insight {
  icon: string;
  text: string;
  highlightedText: { before: string; value: string; after: string };
  trend: "up" | "down" | "neutral";
  type: InsightType;
}
