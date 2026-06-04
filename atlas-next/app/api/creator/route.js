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

export async function POST(request) {
  try {
    const { messages, system, mode } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const systemPrompt = mode === "refine"
      ? "You are a helpful planning assistant. Write warm, specific, actionable summaries. Plain text only."
      : (system || SYSTEM_PROMPT);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", res.status, err);
      return NextResponse.json({ error: "AI service error" }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content?.map(b => b.text ?? "").join("") ?? "";
    return NextResponse.json({ text });

  } catch (err) {
    console.error("Creator API route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
