import { useState } from "react";
import { Receipt as ReceiptIcon, Trash2 } from "lucide-react";
import { Receipt } from "@/types/receipt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  receipt: Receipt;
  onSelect: (receipt: Receipt) => void;
  onDelete?: (id: string) => void;
}

const ReceiptCard = ({ receipt, onSelect, onDelete }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => onSelect(receipt)}
        className="w-full text-left bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md hover:border-accent/40 active:scale-[0.98] transition-all duration-200 group relative"
      >
        {onDelete && (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.stopPropagation(); setShowConfirm(true); }
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
          >
            <Trash2 className="w-4 h-4" />
          </div>
        )}

        <div className="flex justify-between items-start pr-8">
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

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this?</AlertDialogTitle>
            <AlertDialogDescription>
              The receipt from <strong>{receipt.store}</strong> will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete?.(receipt.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReceiptCard;
