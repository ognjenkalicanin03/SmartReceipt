import { Receipt as ReceiptIcon } from "lucide-react";
import { Receipt } from "@/types/receipt";

interface Props {
  receipt: Receipt;
  onSelect: (receipt: Receipt) => void;
}

const ReceiptCard = ({ receipt, onSelect }: Props) => (
  <button
    onClick={() => onSelect(receipt)}
    className="w-full text-left bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md hover:border-accent/40 active:scale-[0.98] transition-all duration-200 group"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <ReceiptIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{receipt.store}</p>
          <p className="text-xs text-muted-foreground">{receipt.date}</p>
        </div>
      </div>
      <span className="font-bold text-foreground">{receipt.total.toFixed(2)} RSD</span>
    </div>
    <div className="mt-2 ml-[52px] space-y-0.5">
      {receipt.items.slice(0, 3).map((item) => (
        <div key={item.name} className="flex justify-between text-xs text-muted-foreground">
          <span>{item.name}</span>
          <span className="font-medium text-foreground/70">{item.price.toFixed(2)} RSD</span>
        </div>
      ))}
    </div>
    <div className="flex gap-1.5 mt-2 ml-[52px]">
      {receipt.categories.map((c) => (
        <span key={c} className="px-2 py-0.5 rounded-full bg-secondary/50 text-[10px] font-medium text-secondary-foreground">
          {c}
        </span>
      ))}
    </div>
  </button>
);

export default ReceiptCard;
