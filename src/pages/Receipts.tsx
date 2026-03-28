import { useState } from "react";
import { Receipt, TrendingUp, TrendingDown, ShoppingCart, DollarSign, Hash, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

// Mock data
const spendingData = [
  { name: "Food", value: 245.8, color: "hsl(27, 38%, 73%)" },
  { name: "Drinks", value: 89.5, color: "hsl(193, 74%, 82%)" },
  { name: "Snacks", value: 67.2, color: "hsl(245, 16%, 18%)" },
  { name: "Hygiene", value: 54.0, color: "hsl(340, 65%, 65%)" },
];

const insights = [
  { icon: "🍕", text: "Food takes up 54% of your spending", highlight: "54%", trend: "up" as const },
  { icon: "📈", text: "You spent 12% more this week than last", highlight: "12%", trend: "up" as const },
  { icon: "🛒", text: "Most purchased item: Milk (bought 5 times)", highlight: "5 times", trend: "neutral" as const },
  { icon: "💡", text: "Snack spending decreased by 8%", highlight: "8%", trend: "down" as const },
];

const receipts = [
  { id: 1, store: "Walmart", date: "Mar 26, 2026", total: 48.92, items: ["Milk", "Bread", "Eggs"], categories: ["Food"] },
  { id: 2, store: "CVS Pharmacy", date: "Mar 25, 2026", total: 23.15, items: ["Shampoo", "Toothpaste"], categories: ["Hygiene"] },
  { id: 3, store: "Target", date: "Mar 24, 2026", total: 67.30, items: ["Chicken", "Rice", "Soda"], categories: ["Food", "Drinks"] },
  { id: 4, store: "Trader Joe's", date: "Mar 23, 2026", total: 35.80, items: ["Granola", "Chips", "Juice"], categories: ["Snacks", "Drinks"] },
  { id: 5, store: "Whole Foods", date: "Mar 22, 2026", total: 89.40, items: ["Salmon", "Avocado", "Quinoa"], categories: ["Food"] },
];

const timeFilters = ["Week", "Month", "All time"];
const categoryFilters = ["All", "Food", "Drinks", "Snacks", "Hygiene"];

const totalSpent = receipts.reduce((sum, r) => sum + r.total, 0);
const avgSpend = totalSpent / receipts.length;

const Receipts = () => {
  const [activeTime, setActiveTime] = useState("Month");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="flex-1 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* Summary Cards */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: DollarSign },
            { label: "Receipts", value: receipts.length.toString(), icon: Hash },
            { label: "Avg / Receipt", value: `$${avgSpend.toFixed(2)}`, icon: BarChart3 },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center gap-2 text-center"
            >
              <card.icon className="w-5 h-5 text-accent" />
              <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
              <span className="text-lg font-bold text-foreground">{card.value}</span>
            </div>
          ))}
        </section>

        {/* Spending Chart */}
        <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-border/50">
          <h2 className="text-base font-semibold text-foreground mb-4">Where your money goes</h2>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            {spendingData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-semibold text-foreground">${item.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Insights</h2>
          {insights.map((insight, i) => (
            <div
              key={i}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-3"
            >
              <span className="text-2xl">{insight.icon}</span>
              <p className="text-sm text-muted-foreground flex-1">
                {insight.text}
              </p>
              {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-destructive shrink-0" />}
              {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-green-500 shrink-0" />}
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {timeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveTime(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  activeTime === f
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card/60 text-muted-foreground border-border/50 hover:bg-card"
                )}
              >
                {f}
              </button>
            ))}
            <div className="w-px bg-border/50 mx-1 shrink-0" />
            {categoryFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveCategory(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  activeCategory === f
                    ? "bg-accent text-accent-foreground border-accent shadow-md"
                    : "bg-card/60 text-muted-foreground border-border/50 hover:bg-card"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Receipt History */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Recent Receipts</h2>
          {receipts.map((r) => (
            <button
              key={r.id}
              className="w-full text-left bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md hover:border-accent/40 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{r.store}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <span className="font-bold text-foreground">${r.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-[52px]">
                {r.items.join(" · ")}
              </p>
              <div className="flex gap-1.5 mt-2 ml-[52px]">
                {r.categories.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-secondary/50 text-[10px] font-medium text-secondary-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Receipts;
