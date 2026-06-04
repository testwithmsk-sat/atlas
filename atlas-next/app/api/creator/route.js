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

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_KEY ||
      "";

    if (!apiKey) {
      const found = Object.keys(process.env)
        .filter(k => k.includes("GEMINI") || k.includes("GOOGLE") || k.includes("AI_GATEWAY"))
        .join(", ") || "none";
      return NextResponse.json(
        { error: `API key not found. Add GEMINI_API_KEY to Vercel env vars and redeploy. (Related vars visible: ${found})` },
        { status: 500 }
      );
    }

    const systemPrompt = mode === "refine" ? REFINE_PROMPT : SYSTEM_PROMPT;

    // Use proper systemInstruction field — avoids role ordering issues
    const geminiContents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[creator] Gemini API error:", res.status, err);
      return NextResponse.json({ error: `Gemini API error ${res.status}: ${err}` }, { status: 502 });
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

// Debug endpoint — visit /api/creator in browser to check env vars
export async function GET() {
  const found = Object.keys(process.env)
    .filter(k => k.includes("GEMINI") || k.includes("GOOGLE") || k.includes("AI_GATEWAY"))
    .reduce((acc, k) => {
      acc[k] = process.env[k] ? `set (${process.env[k].slice(0, 6)}...)` : "empty";
      return acc;
    }, {});
  return NextResponse.json({ status: "ok", relatedEnvVars: found });
}
