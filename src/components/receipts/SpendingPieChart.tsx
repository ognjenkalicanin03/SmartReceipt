import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SpendingCategory } from "@/types/receipt";
import { useAuth } from "@/contexts/AuthContext";
import { formatAmount } from "@/lib/currency";

interface Props {
  data: SpendingCategory[];
}

const SpendingPieChart = ({ data }: Props) => {
  const { profile } = useAuth();
  const currency = profile.currency;

  if (data.length === 0) return null;

  return (
    <section className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-border/50 transition-all duration-300">
      <h2 className="text-base font-semibold text-foreground mb-4">Where your money goes</h2>
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationDuration={600}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-semibold text-foreground">{formatAmount(item.value, currency)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpendingPieChart;
