import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receipt } from "@/types/receipt";
import { useAuth } from "@/contexts/AuthContext";

export function useReceipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipts = async () => {
    if (!user) {
      setReceipts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: receiptRows, error } = await supabase
      .from("receipts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching receipts:", error);
      setLoading(false);
      return;
    }

    // Fetch items for all receipts
    const receiptIds = (receiptRows || []).map((r: any) => r.id);
    let itemsMap: Record<string, any[]> = {};

    if (receiptIds.length > 0) {
      const { data: items } = await supabase
        .from("receipt_items")
        .select("*")
        .in("receipt_id", receiptIds);

      (items || []).forEach((item: any) => {
        if (!itemsMap[item.receipt_id]) itemsMap[item.receipt_id] = [];
        itemsMap[item.receipt_id].push(item);
      });
    }

    const mapped: Receipt[] = (receiptRows || []).map((r: any) => {
      const items = itemsMap[r.id] || [];
      return {
        id: r.id,
        store: r.store,
        date: r.date,
        total: Number(r.total),
        items: items.map((i: any) => ({ name: i.name, price: Number(i.price), category: i.category })),
        categories: [...new Set(items.map((i: any) => i.category || "Other"))],
        image_url: r.image_url,
        created_at: r.created_at,
      };
    });

    setReceipts(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchReceipts();
  }, [user]);

  return { receipts, loading, refetch: fetchReceipts };
}
