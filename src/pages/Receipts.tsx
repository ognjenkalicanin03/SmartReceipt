import { useState, useMemo } from "react";
import { Receipt } from "@/types/receipt";
import { useReceipts } from "@/hooks/useReceipts";
import { getSpendingData, getInsights, categoryFilters } from "@/data/receiptData";
import SummaryCards from "@/components/receipts/SummaryCards";
import SpendingPieChart from "@/components/receipts/SpendingPieChart";
import InsightsList from "@/components/receipts/InsightsList";
import FiltersBar from "@/components/receipts/FiltersBar";
import ReceiptList from "@/components/receipts/ReceiptList";
import ReceiptDetail from "@/components/receipts/ReceiptDetail";
import { Loader2 } from "lucide-react";

const timeFilters = ["Week", "Month", "All time"] as const;

const Receipts = () => {
  const { receipts, loading, deleteReceipt } = useReceipts();
  const [activeTime, setActiveTime] = useState("All time");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const filtered = useMemo(() => {
    let result = receipts;

    // Time filtering based on created_at
    if (activeTime === "Week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter((r) => new Date(r.created_at || "") >= weekAgo);
    } else if (activeTime === "Month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      result = result.filter((r) => new Date(r.created_at || "") >= monthAgo);
    }

    if (activeCategory !== "All") {
      result = result.filter((r) => r.categories.includes(activeCategory));
    }

    return result;
  }, [receipts, activeTime, activeCategory]);

  // Derive dynamic category filters from actual data
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    receipts.forEach((r) => r.categories.forEach((c) => cats.add(c)));
    return ["All", ...Array.from(cats).sort()];
  }, [receipts]);

  const spending = useMemo(() => getSpendingData(filtered), [filtered]);
  const insights = useMemo(() => getInsights(filtered), [filtered]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <SummaryCards receipts={filtered} />
        {filtered.length > 0 && <SpendingPieChart data={spending} />}
        {filtered.length > 0 && <InsightsList insights={insights} />}
        <FiltersBar
          timeFilters={timeFilters}
          categoryFilters={dynamicCategories}
          activeTime={activeTime}
          activeCategory={activeCategory}
          onTimeChange={setActiveTime}
          onCategoryChange={setActiveCategory}
        />
        <ReceiptList receipts={filtered} onSelect={setSelectedReceipt} onDelete={deleteReceipt} />
      </div>
      <ReceiptDetail
        receipt={selectedReceipt}
        open={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default Receipts;
