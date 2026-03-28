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

export interface Insight {
  icon: string;
  text: string;
  highlight: string;
  trend: "up" | "down" | "neutral";
}
