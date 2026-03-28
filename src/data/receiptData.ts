import { Receipt, SpendingCategory, Insight } from "@/types/receipt";

export const allReceipts: Receipt[] = [
  { id: 1, store: "Walmart", date: "Mar 26, 2026", total: 48.92, items: [{ name: "Milk", price: 4.29 }, { name: "Bread", price: 3.49 }, { name: "Eggs", price: 5.99 }], categories: ["Food"] },
  { id: 2, store: "CVS Pharmacy", date: "Mar 25, 2026", total: 23.15, items: [{ name: "Shampoo", price: 8.49 }, { name: "Toothpaste", price: 4.99 }], categories: ["Hygiene"] },
  { id: 3, store: "Target", date: "Mar 24, 2026", total: 67.30, items: [{ name: "Chicken", price: 12.99 }, { name: "Rice", price: 6.49 }, { name: "Soda", price: 5.99 }], categories: ["Food", "Drinks"] },
  { id: 4, store: "Trader Joe's", date: "Mar 23, 2026", total: 35.80, items: [{ name: "Granola", price: 4.99 }, { name: "Chips", price: 3.49 }, { name: "Juice", price: 4.29 }], categories: ["Snacks", "Drinks"] },
  { id: 5, store: "Whole Foods", date: "Mar 22, 2026", total: 89.40, items: [{ name: "Salmon", price: 14.99 }, { name: "Avocado", price: 2.49 }, { name: "Quinoa", price: 7.99 }], categories: ["Food"] },
  { id: 6, store: "Costco", date: "Mar 15, 2026", total: 142.60, items: [{ name: "Paper Towels", price: 18.99 }, { name: "Detergent", price: 14.49 }, { name: "Soap", price: 9.99 }], categories: ["Hygiene"] },
  { id: 7, store: "Aldi", date: "Mar 10, 2026", total: 31.20, items: [{ name: "Yogurt", price: 3.29 }, { name: "Cookies", price: 2.99 }, { name: "Pretzels", price: 1.99 }], categories: ["Food", "Snacks"] },
];

export const timeFilters = ["Week", "Month", "All time"] as const;
export const categoryFilters = ["All", "Food", "Drinks", "Snacks", "Hygiene"] as const;

export function getFilteredReceipts(time: string, category: string): Receipt[] {
  let filtered = allReceipts;

  if (time === "Week") {
    filtered = filtered.slice(0, 4);
  } else if (time === "Month") {
    filtered = filtered.slice(0, 5);
  }

  if (category !== "All") {
    filtered = filtered.filter((r) => r.categories.includes(category));
  }

  return filtered;
}

export function getSpendingData(receipts: Receipt[]): SpendingCategory[] {
  const catMap: Record<string, number> = {};
  const colorMap: Record<string, string> = {
    Food: "hsl(27, 38%, 73%)",
    Drinks: "hsl(193, 74%, 82%)",
    Snacks: "hsl(245, 16%, 18%)",
    Hygiene: "hsl(340, 65%, 65%)",
  };

  receipts.forEach((r) => {
    const share = r.total / r.categories.length;
    r.categories.forEach((c) => {
      catMap[c] = (catMap[c] || 0) + share;
    });
  });

  return Object.entries(catMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    color: colorMap[name] || "hsl(0, 0%, 60%)",
  }));
}

export function getInsights(receipts: Receipt[]): Insight[] {
  const total = receipts.reduce((s, r) => s + r.total, 0);
  const spending = getSpendingData(receipts);
  const top = spending.sort((a, b) => b.value - a.value)[0];
  const topPct = total > 0 ? Math.round((top?.value / total) * 100) : 0;

  return [
    { icon: "🍕", text: `${top?.name || "Food"} takes up ${topPct}% of your spending`, highlight: `${topPct}%`, trend: "up" },
    { icon: "📈", text: "You spent 12% more this week than last", highlight: "12%", trend: "up" },
    { icon: "🛒", text: "Most purchased item: Milk (bought 5 times)", highlight: "5 times", trend: "neutral" },
    { icon: "💡", text: "Snack spending decreased by 8%", highlight: "8%", trend: "down" },
  ];
}
