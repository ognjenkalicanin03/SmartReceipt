import { Receipt } from "@/types/receipt";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Receipt as ReceiptIcon, X } from "lucide-react";

interface Props {
  receipt: Receipt | null;
  open: boolean;
  onClose: () => void;
}

const ReceiptDetail = ({ receipt, open, onClose }: Props) => {
  if (!receipt) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto bg-background border-border">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <ReceiptIcon className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg text-foreground">{receipt.store}</SheetTitle>
              <p className="text-sm text-muted-foreground">{receipt.date}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 pb-6">
          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {receipt.categories.map((c) => (
              <span key={c} className="px-3 py-1 rounded-full bg-secondary/50 text-xs font-medium text-secondary-foreground">
                {c}
              </span>
            ))}
          </div>

          {/* Items */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">Items</h3>
            {receipt.items.map((item) => (
              <div key={item.name} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm font-semibold text-foreground">{item.price.toFixed(2)} RSD</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between pt-3 border-t-2 border-accent/30">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-base font-bold text-accent">{receipt.total.toFixed(2)} RSD</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptDetail;
