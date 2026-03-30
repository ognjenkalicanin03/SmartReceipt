import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Trophy, CreditCard, BarChart3, ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import { Insight, InsightType, Receipt, SpendingCategory } from "@/types/receipt";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/currency";
import WeeklyReportModal from "./WeeklyReportModal";

interface WeeklyData {
  thisWeekTotal: number;
  lastWeekTotal: number;
  pctChange: number | null;
  thisWeekReceipts: Receipt[];
  topCategory: SpendingCategory | null;
  explanation: string;
  suggestion: string;
  loading: boolean;
}

interface Props {
  insights: Insight[];
  weeklyData?: WeeklyData;
  currency: string;
  onLoadWeeklyAI?: () => void;
}

const typeIcon: Record<InsightType, React.ReactNode> = {
  distribution: <BarChart3 className="w-4 h-4" />,
  trend: <ArrowUpRight className="w-4 h-4" />,
  "top-item": <Trophy className="w-4 h-4" />,
  impulse: <AlertTriangle className="w-4 h-4" />,
  "category-high": <CreditCard className="w-4 h-4" />,
  prediction: <TrendingUp className="w-4 h-4" />,
};

const typeAccent: Record<InsightType, string> = {
  distribution: "bg-accent/15 text-accent border-accent/20",
  trend: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  "top-item": "bg-primary/10 text-primary border-primary/20",
  impulse: "bg-destructive/10 text-destructive border-destructive/20",
  "category-high": "bg-muted text-muted-foreground border-border/50",
  prediction: "bg-primary/10 text-primary border-primary/20",
};

const InsightsList = ({ insights, weeklyData, currency, onLoadWeeklyAI }: Props) => {
  const [reportOpen, setReportOpen] = useState(false);

  if (insights.length === 0 && !weeklyData) return null;

  const handleWeeklyClick = () => {
    if (weeklyData && !weeklyData.explanation && !weeklyData.loading && onLoadWeeklyAI) {
      onLoadWeeklyAI();
    }
    setReportOpen(true);
  };

  const direction = weeklyData?.pctChange !== null && weeklyData?.pctChange !== undefined
    ? (weeklyData.pctChange >= 0 ? "up" : "down")
    : null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-foreground">Smart Insights</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-[10px] font-bold text-accent tracking-wide uppercase">AI</span>
      </div>

      {/* Weekly Insight Card — first position, more prominent */}
      {weeklyData && (
        <button
          onClick={handleWeeklyClick}
          className={cn(
            "w-full text-left rounded-2xl p-5 shadow-md border flex items-start gap-3 transition-all duration-300",
            "bg-gradient-to-br from-primary/8 to-accent/5 border-primary/20 hover:shadow-lg hover:border-primary/30"
          )}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/15 text-primary border border-primary/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-primary/15 text-[9px] font-bold text-primary tracking-wide uppercase">Weekly</span>
            </div>
            {weeklyData.loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Analyzing…
              </div>
            ) : weeklyData.pctChange !== null ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                You spent{" "}
                <span className="font-bold text-foreground">
                  {direction === "up" ? "+" : ""}{weeklyData.pctChange}%
                </span>{" "}
                {direction === "up" ? "more" : "less"} than last week
                {weeklyData.topCategory && (
                  <span className="block text-xs mt-0.5 text-muted-foreground/80">
                    Top: {weeklyData.topCategory.name} — {formatAmount(weeklyData.topCategory.value, currency)}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                This week: <span className="font-bold text-foreground">{formatAmount(weeklyData.thisWeekTotal, currency)}</span>
              </p>
            )}
          </div>
          <div className="shrink-0 mt-1">
            {direction === "up" && <TrendingUp className="w-4 h-4 text-destructive" />}
            {direction === "down" && <TrendingDown className="w-4 h-4 text-accent" />}
          </div>
        </button>
      )}

      {/* Other insight cards */}
      {insights.map((insight, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl p-4 shadow-sm border flex items-start gap-3 transition-all duration-300",
            "bg-card/80 backdrop-blur-sm border-border/50"
          )}
        >
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", typeAccent[insight.type])}>
            {typeIcon[insight.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span>{insight.highlightedText.before} </span>
              <span className="font-bold text-foreground">{insight.highlightedText.value}</span>
              <span> {insight.highlightedText.after}</span>
            </p>
          </div>
          <div className="shrink-0 mt-0.5">
            {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-destructive" />}
            {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-accent" />}
          </div>
        </div>
      ))}

      {/* Weekly Report Modal */}
      {weeklyData && (
        <WeeklyReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          data={weeklyData}
          currency={currency}
        />
      )}
    </section>
  );
};

export default InsightsList;
