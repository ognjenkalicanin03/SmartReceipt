import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["Food", "Drinks", "Snacks", "Hygiene", "Transport", "Beauty", "Other"] as const;

const ManualEntry = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [date, setDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    setSubmitting(true);

    const { data: receipt, error: rErr } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        store: title.trim(),
        total: Number(amount),
        date: format(date, "MMM dd, yyyy"),
        is_manual: true,
      })
      .select("id")
      .single();

    if (rErr || !receipt) {
      console.error("Error creating manual entry:", rErr);
      toast.error("Failed to save expense");
      setSubmitting(false);
      return;
    }

    await supabase.from("receipt_items").insert({
      receipt_id: receipt.id,
      name: title.trim(),
      price: Number(amount),
      category,
    });

    toast.success("Expense saved!");
    navigate("/receipts");
  };

  return (
    <div className="flex-1 pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Add Expense</h1>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Taxi, Market, Coffee"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 text-base"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (RSD)</Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 text-base"
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  category === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

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
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Save Expense"}
        </Button>
      </div>
    </div>
  );
};

export default ManualEntry;
