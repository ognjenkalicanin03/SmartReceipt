import { useState, useMemo } from "react";
import { Receipt } from "@/types/receipt";
import { timeFilters, categoryFilters, getFilteredReceipts, getSpendingData, getInsights } from "@/data/receiptData";
import SummaryCards from "@/components/receipts/SummaryCards";
import SpendingPieChart from "@/components/receipts/SpendingPieChart";
import InsightsList from "@/components/receipts/InsightsList";
import FiltersBar from "@/components/receipts/FiltersBar";
import ReceiptList from "@/components/receipts/ReceiptList";
import ReceiptDetail from "@/components/receipts/ReceiptDetail";

const Receipts = () => {
  const [activeTime, setActiveTime] = useState("Month");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const filtered = useMemo(() => getFilteredReceipts(activeTime, activeCategory), [activeTime, activeCategory]);
  const spending = useMemo(() => getSpendingData(filtered), [filtered]);
  const insights = useMemo(() => getInsights(filtered), [filtered]);

  return (
    <div className="flex-1 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <SummaryCards receipts={filtered} />
        <SpendingPieChart data={spending} />
        <InsightsList insights={insights} />
        <FiltersBar
          timeFilters={timeFilters}
          categoryFilters={categoryFilters}
          activeTime={activeTime}
          activeCategory={activeCategory}
          onTimeChange={setActiveTime}
          onCategoryChange={setActiveCategory}
        />
        <ReceiptList receipts={filtered} onSelect={setSelectedReceipt} />
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
