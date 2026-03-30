import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Sparkles, Loader2, X, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getCountryInfo, formatAmount } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExpenseItem {
  title: string;
  amount: number;
  category: string;
}

const ManualEntry = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const currencyInfo = getCountryInfo(profile.country);
  const [quickInput, setQuickInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleQuickParse = useCallback(async () => {
    const text = quickInput.trim();
    if (!text) return;

    setParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-expense", {
        body: { text },
      });

      if (error) throw error;

      if (data?.title && data?.amount && data.amount > 0) {
        setItems((prev) => [
          ...prev,
          {
            title: data.title,
            amount: data.amount,
            category: data.category || "Other",
          },
        ]);
        setQuickInput("");
        toast.success(`Added: ${data.title}`);
      } else {
        toast.error("Could not parse input. Try e.g. 'taxi 500'");
      }
    } catch (err) {
      console.error("Quick parse failed:", err);
      toast.error("Could not parse input. Try again.");
    } finally {
      setParsing(false);
    }
  }, [quickInput]);

  const handleQuickInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickParse();
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async () => {
    if (!user || items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    setSubmitting(true);

    const storeName = items.length === 1 ? items[0].title : `${items.length} items`;

    const { data: receipt, error: rErr } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        store: storeName,
        total,
        date: format(date, "MMM dd, yyyy"),
        is_manual: true,
      })
      .select("id")
      .single();

    if (rErr || !receipt) {
      console.error("Error creating manual entry:", rErr);
      toast.error("Failed to save receipt");
      setSubmitting(false);
      return;
    }

    const itemRows = items.map((item) => ({
      receipt_id: receipt.id,
      name: item.title,
      price: item.amount,
      category: item.category,
    }));

    await supabase.from("receipt_items").insert(itemRows);

    toast.success("Receipt saved!");
    navigate("/receipts");
  };

  return (
    <div className="flex-1 pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Add Expense</h1>

        {/* Quick Add AI */}
        <div className="space-y-2">
          <Label htmlFor="quick-add" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick add (AI)
          </Label>
          <div className="flex gap-2">
            <Input
              id="quick-add"
              placeholder='e.g. "nails 2000" or "taxi 500"'
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={handleQuickInputKeyDown}
              className="h-12 text-base flex-1"
              disabled={parsing}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={handleQuickParse}
              disabled={parsing || !quickInput.trim()}
            >
              {parsing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Type a short description and press Enter to add an item.
          </p>
        </div>

        {/* Items list */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1.5">
            <ShoppingCart className="h-4 w-4" />
            Items ({items.length})
          </Label>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No items yet. Use Quick Add above to add expenses.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      {formatAmount(item.amount, currencyInfo.currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-base font-bold text-foreground">
                  {formatAmount(total, currencyInfo.currency)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* Date */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-12 justify-start text-left text-base font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          disabled={submitting || items.length === 0}
        >
          {submitting ? "Saving…" : `Save Receipt (${items.length} item${items.length !== 1 ? "s" : ""})`}
        </Button>
      </div>
    </div>
  );
};

export default ManualEntry;
