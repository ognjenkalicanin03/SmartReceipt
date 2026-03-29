import { DollarSign, Hash, BarChart3 } from "lucide-react";
import { Receipt } from "@/types/receipt";
import { useAuth } from "@/contexts/AuthContext";
import { formatAmount } from "@/lib/currency";

interface Props {
  receipts: Receipt[];
}

const SummaryCards = ({ receipts }: Props) => {
  const { profile } = useAuth();
  const currency = profile.currency;

  const total = receipts.reduce((s, r) => s + r.total, 0);
  const avg = receipts.length > 0 ? total / receipts.length : 0;

  const cards = [
    { label: "Total Spent", value: formatAmount(total, currency), icon: DollarSign },
    { label: "Receipts", value: receipts.length.toString(), icon: Hash },
    { label: "Avg / Receipt", value: formatAmount(avg, currency), icon: BarChart3 },
  ];

  return (
    <section className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 flex flex-col items-center gap-2 text-center transition-all duration-300"
        >
          <card.icon className="w-5 h-5 text-accent" />
          <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
          <span className="text-lg font-bold text-foreground">{card.value}</span>
        </div>
      ))}
    </section>
  );
};

export default SummaryCards;
