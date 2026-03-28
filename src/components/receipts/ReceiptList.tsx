import { Receipt } from "@/types/receipt";
import ReceiptCard from "./ReceiptCard";

interface Props {
  receipts: Receipt[];
  onSelect: (receipt: Receipt) => void;
  onDelete?: (id: string) => void;
}

const ReceiptList = ({ receipts, onSelect, onDelete }: Props) => (
  <section className="space-y-3">
    <h2 className="text-base font-semibold text-foreground">Recent Receipts</h2>
    {receipts.length === 0 ? (
      <div className="bg-card/80 rounded-2xl p-8 text-center border border-border/50">
        <p className="text-muted-foreground text-sm">No receipts found for this filter.</p>
      </div>
    ) : (
      receipts.map((r) => <ReceiptCard key={r.id} receipt={r} onSelect={onSelect} onDelete={onDelete} />)
    )}
  </section>
);

export default ReceiptList;
