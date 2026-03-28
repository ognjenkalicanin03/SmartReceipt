import { TrendingUp, TrendingDown, AlertTriangle, Trophy, CreditCard, BarChart3, ArrowUpRight } from "lucide-react";
import { Insight, InsightType } from "@/types/receipt";
import { cn } from "@/lib/utils";

interface Props {
  insights: Insight[];
}

const typeIcon: Record<InsightType, React.ReactNode> = {
  distribution: <BarChart3 className="w-4 h-4" />,
  trend: <ArrowUpRight className="w-4 h-4" />,
  "top-item": <Trophy className="w-4 h-4" />,
  impulse: <AlertTriangle className="w-4 h-4" />,
  "category-high": <CreditCard className="w-4 h-4" />,
};

const typeAccent: Record<InsightType, string> = {
  distribution: "bg-accent/15 text-accent border-accent/20",
  trend: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  "top-item": "bg-primary/10 text-primary border-primary/20",
  impulse: "bg-destructive/10 text-destructive border-destructive/20",
  "category-high": "bg-muted text-muted-foreground border-border/50",
};

const InsightsList = ({ insights }: Props) => {
  if (insights.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-foreground">Smart Insights</h2>
        <span className="px-2 py-0.5 rounded-full bg-accent/20 text-[10px] font-bold text-accent tracking-wide uppercase">AI</span>
      </div>
      {insights.map((insight, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl p-4 shadow-sm border flex items-start gap-3 transition-all duration-300",
            "bg-card/80 backdrop-blur-sm border-border/50"
          )}
        >
          {/* Type indicator */}
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border", typeAccent[insight.type])}>
            {typeIcon[insight.type]}
          </div>

          {/* Text with highlighted value */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span>{insight.highlightedText.before} </span>
              <span className="font-bold text-foreground">{insight.highlightedText.value}</span>
              <span> {insight.highlightedText.after}</span>
            </p>
          </div>

          {/* Trend arrow */}
          <div className="shrink-0 mt-0.5">
            {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-destructive" />}
            {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-accent" />}
          </div>
        </div>
      ))}
    </section>
  );
};

export default InsightsList;
