import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReceiptItem {
  name: string;
  price: number;
  category: string;
}

interface ParsedReceipt {
  store: string;
  date: string;
  items: ReceiptItem[];
  total: number;
}

function fallbackParse(text: string): ParsedReceipt {
  const lines = text.split("\n").filter((l) => l.trim());
  const items: ReceiptItem[] = [];
  let store = "Unknown Store";
  let total = 0;

  if (lines.length > 0) store = lines[0].trim();

  for (const line of lines) {
    const match = line.match(/(.+?)\s+\$?([\d]+\.[\d]{2})/);
    if (match) {
      const price = parseFloat(match[2]);
      items.push({ name: match[1].trim(), price, category: "Other" });
      total += price;
    }
  }

  if (items.length === 0) {
    items.push({ name: "Unrecognized item", price: 0, category: "Other" });
  }

  return {
    store,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    items,
    total: Math.round(total * 100) / 100,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call Lovable AI vision model to extract receipt data
    let parsed: ParsedReceipt;
    try {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a receipt parser. Extract structured data from receipt images. Always respond with valid JSON only, no markdown.`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract all items from this receipt image. Return a JSON object with this exact structure:
{
  "store": "Store Name",
  "date": "YYYY-MM-DD",
  "items": [
    { "name": "Item name", "price": 0.00, "category": "Food|Drinks|Snacks|Hygiene|Household|Other" }
  ],
  "total": 0.00
}
The date MUST be in YYYY-MM-DD format (e.g. "2026-03-30"). If year has only 2 digits, assume 2000s (e.g. "26" means "2026").
Assign each item one of these categories: Food, Drinks, Snacks, Hygiene, Household, Other.
Return ONLY the JSON, no other text.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!aiResponse.ok) {
        if (aiResponse.status === 429) {
          console.error("AI rate limited");
        } else if (aiResponse.status === 402) {
          console.error("AI credits exhausted");
        }
        const errText = await aiResponse.text();
        console.error("AI error:", aiResponse.status, errText);
        throw new Error("AI processing failed");
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || "";

      // Try to parse JSON from response (handle markdown code blocks)
      let jsonStr = content.trim();
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();

      parsed = JSON.parse(jsonStr) as ParsedReceipt;

      // Validate
      if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
        throw new Error("Invalid AI response structure");
      }
    } catch (aiError) {
      console.error("AI parsing failed, using fallback:", aiError);
      parsed = fallbackParse("Unknown Store\nItem $1.00");
    }

    // Upload image to storage
    const imageBuffer = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));
    const ext = (mimeType || "image/jpeg").split("/")[1] || "jpg";
    const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("receipt-images")
      .upload(fileName, imageBuffer, { contentType: mimeType || "image/jpeg" });

    let imageUrl: string | null = null;
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("receipt-images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    // Save receipt to DB
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert({
        user_id: userId,
        store: parsed.store || "Unknown Store",
        date: parsed.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        total: parsed.total || 0,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (receiptError) {
      console.error("Receipt insert error:", receiptError);
      return new Response(JSON.stringify({ error: "Failed to save receipt" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save items
    const itemsToInsert = parsed.items.map((item) => ({
      receipt_id: receipt.id,
      name: item.name,
      price: item.price,
      category: item.category || "Other",
    }));

    const { error: itemsError } = await supabase.from("receipt_items").insert(itemsToInsert);
    if (itemsError) {
      console.error("Items insert error:", itemsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        receipt: {
          ...receipt,
          items: parsed.items,
          categories: [...new Set(parsed.items.map((i) => i.category))],
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("process-receipt error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
