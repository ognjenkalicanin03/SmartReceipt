import { useState, useMemo, useCallback } from "react";
import { Receipt } from "@/types/receipt";
import { useReceipts } from "@/hooks/useReceipts";
import { getSpendingData, getInsights } from "@/data/receiptData";
import { useAuth } from "@/contexts/AuthContext";
import { formatAmount } from "@/lib/currency";
import { getReceiptDate } from "@/lib/dateUtils";
import { supabase } from "@/integrations/supabase/client";
import SummaryCards from "@/components/receipts/SummaryCards";
import SpendingPieChart from "@/components/receipts/SpendingPieChart";
import InsightsList from "@/components/receipts/InsightsList";
import FiltersBar from "@/components/receipts/FiltersBar";
import ReceiptList from "@/components/receipts/ReceiptList";
import ReceiptDetail from "@/components/receipts/ReceiptDetail";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const timeFilters = ["Week", "Month", "All time"] as const;

const Receipts = () => {
  const { receipts, loading, deleteReceipt } = useReceipts();
  const { profile } = useAuth();
  const currency = profile?.currency || "RSD";
  const [activeTime, setActiveTime] = useState("All time");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [weeklyAI, setWeeklyAI] = useState<{ explanation: string; suggestion: string; loading: boolean }>({
    explanation: "",
    suggestion: "",
    loading: false,
  });
  const [predictionAI, setPredictionAI] = useState<{ explanation: string; loading: boolean }>({
    explanation: "",
    loading: false,
  });
  const [spendingAlertAI, setSpendingAlertAI] = useState<{ explanation: string; loading: boolean }>({
    explanation: "",
    loading: false,
  });

  const filtered = useMemo(() => {
    const now = new Date();
    let result = receipts;
    if (activeTime === "Week") {
      const cutoff = new Date(now.getTime() - 7 * 86400000);
      result = result.filter((r) => {
        const d = getReceiptDate(r);
        return d !== null && d >= cutoff && d <= now;
      });
    } else if (activeTime === "Month") {
      const cutoff = new Date(now.getTime() - 30 * 86400000);
      result = result.filter((r) => {
        const d = getReceiptDate(r);
        return d !== null && d >= cutoff && d <= now;
      });
    }
    if (activeCategory !== "All") {
      result = result.filter((r) => r.categories.includes(activeCategory));
    }
    return result;
  }, [receipts, activeTime, activeCategory]);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    receipts.forEach((r) => r.categories.forEach((c) => cats.add(c)));
    return ["All", ...Array.from(cats).sort()];
  }, [receipts]);

  const spending = useMemo(() => getSpendingData(filtered), [filtered]);
  const insights = useMemo(() => getInsights(filtered), [filtered]);

  // Weekly data calculation
  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);

    const thisWeekReceipts = receipts.filter((r) => {
      const d = getReceiptDate(r);
      return d !== null && d >= weekAgo && d <= now;
    });
    const lastWeekReceipts = receipts.filter((r) => {
      const d = getReceiptDate(r);
      return d !== null && d >= twoWeeksAgo && d < weekAgo;
    });

    const thisWeekTotal = thisWeekReceipts.reduce((s, r) => s + r.total, 0);
    const lastWeekTotal = lastWeekReceipts.reduce((s, r) => s + r.total, 0);
    const pctChange = lastWeekTotal > 0
      ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100)
      : null;

    const catSpending = getSpendingData(thisWeekReceipts).sort((a, b) => b.value - a.value);
    const topCategory = catSpending[0] || null;

    return {
      thisWeekTotal,
      lastWeekTotal,
      pctChange,
      thisWeekReceipts,
      topCategory,
      explanation: weeklyAI.explanation,
      suggestion: weeklyAI.suggestion,
      loading: weeklyAI.loading,
    };
  }, [receipts, weeklyAI]);

  // Prediction data calculation
  const predictionData = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const daysLeft = daysInMonth - dayOfMonth;

    const last7DaysReceipts = receipts.filter((r) => {
      const d = getReceiptDate(r);
      return d !== null && d >= weekAgo && d <= now;
    });

    const last7DaysTotal = last7DaysReceipts.reduce((s, r) => s + r.total, 0);
    const averageDaily = last7DaysTotal / 7;

    const currentMonthReceipts = receipts.filter((r) => {
      const d = getReceiptDate(r);
      return d !== null && d >= monthStart && d <= now;
    });
    const currentMonthTotal = currentMonthReceipts.reduce((s, r) => s + r.total, 0);

    const predictedTotal = Math.round(averageDaily * daysInMonth);

    return {
      predictedTotal,
      averageDaily: Math.round(averageDaily),
      currentMonthTotal: Math.round(currentMonthTotal),
      daysLeft,
      explanation: predictionAI.explanation,
      loading: predictionAI.loading,
    };
  }, [receipts, predictionAI]);

  // Spending alert calculation
  const spendingAlertData = useMemo(() => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 86400000);
    const weekAgo = new Date(now.getTime() - 7 * 86400000);

    const last3DaysTotal = receipts
      .filter((r) => { const d = getReceiptDate(r); return d !== null && d >= threeDaysAgo && d <= now; })
      .reduce((s, r) => s + r.total, 0);

    const last7DaysTotal = receipts
      .filter((r) => { const d = getReceiptDate(r); return d !== null && d >= weekAgo && d <= now; })
      .reduce((s, r) => s + r.total, 0);

    const averageDaily = last7DaysTotal / 7;
    const triggered = averageDaily > 0 && last3DaysTotal > (averageDaily * 3 * 1.5);

    return {
      triggered,
      last3DaysTotal: Math.round(last3DaysTotal),
      averageDaily: Math.round(averageDaily),
      explanation: spendingAlertAI.explanation,
      loading: spendingAlertAI.loading,
    };
  }, [receipts, spendingAlertAI]);

  const loadWeeklyAI = useCallback(async () => {
    if (weeklyAI.loading || weeklyAI.explanation) return;
    setWeeklyAI((prev) => ({ ...prev, loading: true }));

    try {
      const now = new Date();
      const weekAgoCutoff = new Date(now.getTime() - 7 * 86400000);
      const catSpending = getSpendingData(
        receipts.filter((r) => {
          const d = getReceiptDate(r);
          return d !== null && d >= weekAgoCutoff && d <= now;
        })
      );

      const { data, error } = await supabase.functions.invoke("weekly-insight", {
        body: {
          thisWeekTotal: weeklyData.thisWeekTotal,
          lastWeekTotal: weeklyData.lastWeekTotal,
          categoryBreakdown: catSpending.map((c) => ({ name: c.name, amount: c.value })),
          currency,
        },
      });

      if (error) throw error;
      setWeeklyAI({
        explanation: data.explanation || "",
        suggestion: data.suggestion || "",
        loading: false,
      });
    } catch (e) {
      console.error("Weekly AI error:", e);
      // Fallback
      const top = weeklyData.topCategory;
      setWeeklyAI({
        explanation: top ? `Most spending went to ${top.name}.` : "Not enough data for analysis.",
        suggestion: "Try to reduce non-essential purchases this week.",
        loading: false,
      });
    }
  }, [weeklyAI, receipts, weeklyData, currency]);

  const loadPredictionAI = useCallback(async () => {
    if (predictionAI.loading || predictionAI.explanation) return;
    setPredictionAI((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke("spending-prediction", {
        body: {
          averageDaily: predictionData.averageDaily,
          currentTotal: predictionData.currentMonthTotal,
          predictedTotal: predictionData.predictedTotal,
          currency,
          daysLeft: predictionData.daysLeft,
        },
      });

      if (error) throw error;
      setPredictionAI({
        explanation: data.explanation || "",
        loading: false,
      });
    } catch (e) {
      console.error("Prediction AI error:", e);
      setPredictionAI({
        explanation: "Your recent spending trend suggests steady monthly expenses.",
        loading: false,
      });
    }
  }, [predictionAI, predictionData, currency]);

  const loadSpendingAlertAI = useCallback(async () => {
    if (spendingAlertAI.loading || spendingAlertAI.explanation) return;
    setSpendingAlertAI((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase.functions.invoke("spending-alert", {
        body: {
          last3DaysTotal: spendingAlertData.last3DaysTotal,
          averageDaily: spendingAlertData.averageDaily,
          currency,
        },
      });

      if (error) throw error;
      setSpendingAlertAI({
        explanation: data.explanation || "",
        loading: false,
      });
    } catch (e) {
      console.error("Spending alert AI error:", e);
      setSpendingAlertAI({
        explanation: `You've spent ${Math.round((spendingAlertData.last3DaysTotal / (spendingAlertData.averageDaily * 3)) * 100)}% more than your usual pace in the last 3 days.`,
        loading: false,
      });
    }
  }, [spendingAlertAI, spendingAlertData, currency]);

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
        {receipts.length > 0 && (
          <InsightsList
            insights={insights}
            weeklyData={weeklyData}
            predictionData={predictionData}
            currency={currency}
            onLoadWeeklyAI={loadWeeklyAI}
            onLoadPredictionAI={loadPredictionAI}
          />
        )}
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
