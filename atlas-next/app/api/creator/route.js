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

// Try models in order until one works
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-pro",
];

async function callGemini(apiKey, systemPrompt, messages) {
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  for (const model of MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
        }),
      }
    );

    if (res.status === 404) {
      console.log(`[creator] Model ${model} not found, trying next...`);
      continue;
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini ${model} returned ${res.status}: ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";
    if (text) {
      console.log(`[creator] Success with model: ${model}`);
      return text;
    }
  }

  throw new Error("No Gemini model available. Check your API key at aistudio.google.com");
}

export async function POST(request) {
  try {
    const { messages, mode } = await request.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      "";

    if (!apiKey) {
      const found = Object.keys(process.env)
        .filter(k => k.includes("GEMINI") || k.includes("GOOGLE"))
        .join(", ") || "none";
      return NextResponse.json(
        { error: `GEMINI_API_KEY not set in Vercel. Related vars found: ${found}` },
        { status: 500 }
      );
    }

    const systemPrompt = mode === "refine" ? REFINE_PROMPT : SYSTEM_PROMPT;
    const text = await callGemini(apiKey, systemPrompt, messages);
    return NextResponse.json({ text });

  } catch (err) {
    console.error("[creator] Error:", err?.message);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// Debug — visit /api/creator in browser
export async function GET() {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";

  const keyStatus = apiKey ? `set (${apiKey.slice(0, 8)}...)` : "NOT SET";

  // List available models if key exists
  let availableModels = [];
  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      const data = await res.json();
      availableModels = data.models?.map(m => m.name) ?? [];
    } catch (e) {
      availableModels = [`error listing models: ${e.message}`];
    }
  }

  return NextResponse.json({ keyStatus, availableModels });
}
