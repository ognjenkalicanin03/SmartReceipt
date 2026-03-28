import { TrendingUp, TrendingDown } from "lucide-react";
import { Insight } from "@/types/receipt";

interface Props {
  insights: Insight[];
}

const InsightsList = ({ insights }: Props) => (
  <section className="space-y-3">
    <h2 className="text-base font-semibold text-foreground">Insights</h2>
    {insights.map((insight, i) => (
      <div
        key={i}
        className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-3 transition-all duration-300"
      >
        <span className="text-2xl">{insight.icon}</span>
        <p className="text-sm text-muted-foreground flex-1">{insight.text}</p>
        {insight.trend === "up" && <TrendingUp className="w-4 h-4 text-destructive shrink-0" />}
        {insight.trend === "down" && <TrendingDown className="w-4 h-4 text-secondary-foreground shrink-0" />}
      </div>
    ))}
  </section>
);

export default InsightsList;
