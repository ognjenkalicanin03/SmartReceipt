import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
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

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You extract expense data from short user input. Return ONLY valid JSON with these fields:
- "title": string (the expense name, capitalize first letter)
- "amount": number (the numeric amount)
- "category": string (one of: Food, Drinks, Snacks, Hygiene, Transport, Beauty, Other)

Infer the category intelligently:
- Food: groceries, lunch, dinner, restaurant, market
- Drinks: coffee, juice, beer, wine, water
- Snacks: chips, candy, chocolate, ice cream
- Hygiene: soap, shampoo, toothpaste, toilet paper
- Transport: taxi, bus, gas, fuel, parking, uber
- Beauty: nails, haircut, makeup, salon, spa
- Other: anything else

If you cannot determine the amount, set it to 0.
Return ONLY the JSON object, nothing else.`,
          },
          {
            role: "user",
            content: text.trim(),
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_expense",
              description: "Extract structured expense data from user text",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Expense name" },
                  amount: { type: "number", description: "Expense amount" },
                  category: {
                    type: "string",
                    enum: ["Food", "Drinks", "Snacks", "Hygiene", "Transport", "Beauty", "Other"],
                  },
                },
                required: ["title", "amount", "category"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_expense" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI request failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content directly
    const content = aiData.choices?.[0]?.message?.content || "";
    let jsonStr = content.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    const parsed = JSON.parse(jsonStr);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("parse-expense error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to parse expense" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
