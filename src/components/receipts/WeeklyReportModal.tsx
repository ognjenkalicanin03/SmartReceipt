import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt, SpendingCategory } from "@/types/receipt";
import { getSpendingData } from "@/data/receiptData";
import { formatAmount } from "@/lib/currency";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyReportData {
  thisWeekTotal: number;
  lastWeekTotal: number;
  pctChange: number | null;
  thisWeekReceipts: Receipt[];
  explanation: string;
  suggestion: string;
  topCategory: SpendingCategory | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: WeeklyReportData;
  currency: string;
}

const WeeklyReportModal = ({ open, onClose, data, currency }: Props) => {
  const spending = getSpendingData(data.thisWeekReceipts).sort((a, b) => b.value - a.value);
  const direction = data.pctChange !== null ? (data.pctChange >= 0 ? "up" : "down") : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Weekly Spending Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Totals comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">This Week</p>
              <p className="text-lg font-bold text-foreground">{formatAmount(data.thisWeekTotal, currency)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Last Week</p>
              <p className="text-lg font-bold text-foreground">{formatAmount(data.lastWeekTotal, currency)}</p>
            </div>
          </div>

          {/* Percentage change */}
          {data.pctChange !== null && (
            <div className={cn(
              "rounded-xl p-4 flex items-center gap-3 border",
              direction === "up" ? "bg-destructive/5 border-destructive/20" : "bg-accent/10 border-accent/20"
            )}>
              {direction === "up" ? (
                <TrendingUp className="w-5 h-5 text-destructive" />
              ) : direction === "down" ? (
                <TrendingDown className="w-5 h-5 text-accent" />
              ) : (
                <Minus className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {direction === "up" ? "+" : ""}{data.pctChange}% compared to last week
              </span>
            </div>
          )}

          {/* Category breakdown */}
          {spending.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Category Breakdown</p>
              <div className="space-y-2">
                {spending.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.name}</span>
                    </div>
                    <span className="font-medium">{formatAmount(cat.value, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI explanation & suggestion */}
          <div className="space-y-3">
            {data.explanation && (
              <div className="rounded-xl bg-primary/5 border border-primary/15 p-3">
                <p className="text-xs font-semibold text-primary mb-1">Why?</p>
                <p className="text-sm text-foreground">{data.explanation}</p>
              </div>
            )}
            {data.suggestion && (
              <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
                <p className="text-xs font-semibold text-accent mb-1">Tip</p>
                <p className="text-sm text-foreground">{data.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyReportModal;
