import { NextResponse } from "next/server";

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a digital product planning AI for The Digital Atlas. When given a user's goal, you:
1. Generate a clear, focused product direction title (max 8 words)
2. Write a 2-sentence product description that feels personal and actionable
3. List 3-4 appropriate file formats from: PDF, DOCX, XLSX, PNG, Checklist
4. Write a detailed 150-word AI direction summary that feels like a smart planning partner — specific, warm, action-oriented. Include 2-3 concrete suggestions tailored to their goal.
5. List 4 sample bundle items with emoji and short description

Respond ONLY in this exact JSON format with no markdown or preamble:
{
  "title": "...",
  "description": "...",
  "formats": ["PDF","XLSX"],
  "summary": "...",
  "samples": [
    {"emoji":"📋","name":"...","desc":"..."},
    {"emoji":"💰","name":"...","desc":"..."},
    {"emoji":"📅","name":"...","desc":"..."},
    {"emoji":"✉️","name":"...","desc":"..."}
  ]
}`;

const REFINE_PROMPT = "You are a helpful planning assistant. Write warm, specific, actionable summaries. Plain text only.";

export async function POST(request) {
  try {
    const { messages, mode } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in Vercel environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = mode === "refine" ? REFINE_PROMPT : SYSTEM_PROMPT;

    // Convert messages array to Gemini format
    // Prepend system prompt as first user turn + model ack (Gemini doesn't have a system role in v1)
    const geminiContents = [
      { role: "user",  parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I will follow those instructions exactly." }] },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[creator] Gemini API error:", res.status, err);
      return NextResponse.json(
        { error: `Gemini API returned ${res.status}: ${err}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";

    if (!text) {
      console.error("[creator] Empty Gemini response:", JSON.stringify(data));
      return NextResponse.json({ error: "Empty response from Gemini" }, { status: 502 });
    }

    return NextResponse.json({ text });

  } catch (err) {
    console.error("[creator] Route error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
