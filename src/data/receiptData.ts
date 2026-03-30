import { Receipt, SpendingCategory, Insight } from "@/types/receipt";

export const allReceipts: Receipt[] = [
  { id: "mock-1", store: "Walmart", date: "Mar 26, 2026", total: 48.92, items: [{ name: "Milk", price: 4.29 }, { name: "Bread", price: 3.49 }, { name: "Eggs", price: 5.99 }], categories: ["Food"] },
  { id: "mock-2", store: "CVS Pharmacy", date: "Mar 25, 2026", total: 23.15, items: [{ name: "Shampoo", price: 8.49 }, { name: "Toothpaste", price: 4.99 }], categories: ["Hygiene"] },
  { id: "mock-3", store: "Target", date: "Mar 24, 2026", total: 67.30, items: [{ name: "Chicken", price: 12.99 }, { name: "Rice", price: 6.49 }, { name: "Soda", price: 5.99 }], categories: ["Food", "Drinks"] },
  { id: "mock-4", store: "Trader Joe's", date: "Mar 23, 2026", total: 35.80, items: [{ name: "Granola", price: 4.99 }, { name: "Chips", price: 3.49 }, { name: "Juice", price: 4.29 }], categories: ["Snacks", "Drinks"] },
  { id: "mock-5", store: "Whole Foods", date: "Mar 22, 2026", total: 89.40, items: [{ name: "Salmon", price: 14.99 }, { name: "Avocado", price: 2.49 }, { name: "Quinoa", price: 7.99 }], categories: ["Food"] },
  { id: "mock-6", store: "Costco", date: "Mar 15, 2026", total: 142.60, items: [{ name: "Paper Towels", price: 18.99 }, { name: "Detergent", price: 14.49 }, { name: "Soap", price: 9.99 }], categories: ["Hygiene"] },
  { id: "mock-7", store: "Aldi", date: "Mar 10, 2026", total: 31.20, items: [{ name: "Yogurt", price: 3.29 }, { name: "Cookies", price: 2.99 }, { name: "Pretzels", price: 1.99 }], categories: ["Food", "Snacks"] },
];

export const timeFilters = ["Week", "Month", "All time"] as const;
export const categoryFilters = ["All", "Food", "Drinks", "Snacks", "Hygiene"] as const;

const IMPULSE_CATEGORIES = ["Snacks", "Drinks"];

export function getFilteredReceipts(time: string, category: string): Receipt[] {
  let filtered = allReceipts;
  if (time === "Week") filtered = filtered.slice(0, 4);
  else if (time === "Month") filtered = filtered.slice(0, 5);
  if (category !== "All") filtered = filtered.filter((r) => r.categories.includes(category));
  return filtered;
}

export function getSpendingData(receipts: Receipt[]): SpendingCategory[] {
  const catMap: Record<string, number> = {};
  const colorMap: Record<string, string> = {
    Food: "hsl(27, 38%, 73%)",
    Drinks: "hsl(193, 74%, 82%)",
    Snacks: "hsl(245, 16%, 18%)",
    Hygiene: "hsl(340, 65%, 65%)",
    Household: "hsl(160, 50%, 50%)",
    Other: "hsl(35, 80%, 55%)",
    Electronics: "hsl(220, 60%, 55%)",
    Health: "hsl(0, 65%, 60%)",
    Clothing: "hsl(280, 45%, 60%)",
    Transport: "hsl(50, 70%, 50%)",
    Beauty: "hsl(310, 55%, 60%)",
  };
  // Sum at item level for accurate per-category totals
  receipts.forEach((r) => {
    if (r.items && r.items.length > 0) {
      r.items.forEach((item) => {
        const cat = item.category || "Other";
        catMap[cat] = (catMap[cat] || 0) + item.price;
      });
    } else {
      // Fallback for receipts without items
      const cat = r.categories[0] || "Other";
      catMap[cat] = (catMap[cat] || 0) + r.total;
    }
  });
  return Object.entries(catMap).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    color: colorMap[name] || "hsl(0, 0%, 60%)",
  }));
}

export function getInsights(receipts: Receipt[]): Insight[] {
  if (receipts.length === 0) return [];

  const insights: Insight[] = [];
  const total = receipts.reduce((s, r) => s + r.total, 0);
  const spending = getSpendingData(receipts).sort((a, b) => b.value - a.value);

  // 1 — Top category distribution
  if (spending.length > 0) {
    const top = spending[0];
    const pct = Math.round((top.value / total) * 100);
    insights.push({
      icon: "📊",
      text: `${top.name} takes up ${pct}% of your spending`,
      highlightedText: { before: `${top.name} takes up`, value: `${pct}%`, after: "of your spending" },
      trend: pct > 40 ? "up" : "neutral",
      type: "distribution",
    });
  }

  // 2 — Impulse / unnecessary spending detection
  const impulseTotal = spending
    .filter((s) => IMPULSE_CATEGORIES.includes(s.name))
    .reduce((sum, s) => sum + s.value, 0);
  const impulsePct = total > 0 ? Math.round((impulseTotal / total) * 100) : 0;
  if (impulsePct > 0) {
    insights.push({
      icon: "⚠️",
      text: `Impulse purchases (snacks & drinks) account for ${impulsePct}% — ${impulseTotal.toFixed(0)} total`,
      highlightedText: { before: "Impulse purchases account for", value: `${impulsePct}%`, after: `— ${impulseTotal.toFixed(0)} total` },
      trend: impulsePct > 25 ? "up" : "neutral",
      type: "impulse",
    });
  }

  // 3 — Most frequently purchased item
  const itemCounts: Record<string, number> = {};
  receipts.forEach((r) => r.items.forEach((i) => { itemCounts[i.name] = (itemCounts[i.name] || 0) + 1; }));
  const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0];
  if (topItem) {
    insights.push({
      icon: "🏆",
      text: `Most purchased item: ${topItem[0]} — bought ${topItem[1]} ${topItem[1] === 1 ? "time" : "times"}`,
      highlightedText: { before: "Most purchased:", value: topItem[0], after: `bought ${topItem[1]}×` },
      trend: "neutral",
      type: "top-item",
    });
  }

  // 4 — Trend (week-over-week from actual data)
  if (receipts.length >= 2) {
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const thisWeek = receipts.filter((r) => new Date(r.created_at || "") >= weekAgo).reduce((s, r) => s + r.total, 0);
    const lastWeek = receipts.filter((r) => { const d = new Date(r.created_at || ""); return d >= twoWeeksAgo && d < weekAgo; }).reduce((s, r) => s + r.total, 0);
    if (lastWeek > 0) {
      const change = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
      const direction = change >= 0 ? "up" : "down";
      const absChange = Math.abs(change);
      insights.push({
        icon: direction === "up" ? "📈" : "📉",
        text: `Spending ${direction === "up" ? "increased" : "decreased"} by ${absChange}% compared to last week`,
        highlightedText: { before: `Spending ${direction === "up" ? "increased" : "decreased"} by`, value: `${absChange}%`, after: "vs. last week" },
        trend: direction,
        type: "trend",
      });
    }
  }

  // 5 — Highest single receipt
  const maxReceipt = receipts.reduce((max, r) => (r.total > max.total ? r : max), receipts[0]);
  insights.push({
    icon: "💳",
    text: `Biggest receipt: ${maxReceipt.total.toFixed(2)} RSD at ${maxReceipt.store}`,
    highlightedText: { before: "Biggest receipt:", value: `${maxReceipt.total.toFixed(2)} RSD`, after: `at ${maxReceipt.store}` },
    trend: "neutral",
    type: "category-high",
  });

  return insights.slice(0, 5);
}
