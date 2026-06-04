import { NextResponse } from "next/server";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a digital product planning AI for The Digital Atlas.
Given a user's goal, generate a complete, specific digital product direction.

CRITICAL RULES:
- Be HIGHLY SPECIFIC to the user's actual request — use their exact event, guest count, timeline, budget
- summary field must be plain conversational text ONLY — no JSON, no curly braces, no quotes
- Return ONLY valid JSON with no markdown fences, no backticks, no explanation before or after
- Every checklist item, timeline step, and budget row must be specific to the user's goal

Return this exact JSON structure:
{
  "title": "Specific product title using their details (max 9 words)",
  "description": "2 warm specific sentences about what this covers for their exact goal.",
  "formats": ["PDF", "XLSX", "DOCX"],
  "summary": "150 words of warm expert plain text advice specific to their goal. Include 3 concrete recommendations. No JSON. No symbols. Just helpful sentences.",
  "samples": [
    {"emoji":"📋","name":"Specific document name for their goal","desc":"What this document contains"},
    {"emoji":"💰","name":"Specific document name","desc":"What this contains"},
    {"emoji":"📅","name":"Specific document name","desc":"What this contains"},
    {"emoji":"✉️","name":"Specific document name","desc":"What this contains"}
  ],
  "preview": {
    "checklist": [
      "Specific task 1 tailored to their exact goal",
      "Specific task 2",
      "Specific task 3",
      "Specific task 4",
      "Specific task 5",
      "Specific task 6",
      "Specific task 7",
      "Specific task 8"
    ],
    "timeline": [
      {"phase": "Week 1", "task": "Specific first task", "detail": "Actionable tip"},
      {"phase": "Week 2", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 4", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 6", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 8", "task": "Specific task", "detail": "Tip"},
      {"phase": "2 Weeks Before", "task": "Specific task", "detail": "Tip"},
      {"phase": "Day Before", "task": "Final prep task", "detail": "Tip"},
      {"phase": "Day Of", "task": "Execution task", "detail": "Tip"}
    ],
    "budget": [
      {"category": "Specific cost category for their goal", "estimated": "Realistic amount", "status": "Pending"},
      {"category": "Specific cost category", "estimated": "Realistic amount", "status": "Pending"},
      {"category": "Specific cost category", "estimated": "Realistic amount", "status": "Pending"},
      {"category": "Specific cost category", "estimated": "Realistic amount", "status": "Pending"},
      {"category": "Specific cost category", "estimated": "Realistic amount", "status": "Pending"},
      {"category": "Miscellaneous", "estimated": "Realistic amount", "status": "Pending"}
    ]
  }
}`;

const REFINE_PROMPT = `You are a helpful planning assistant. 
Write warm, specific, actionable planning advice as plain text only. 
No JSON. No bullet symbols. No curly braces. Just helpful sentences.`;

const MODELS = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

async function callGemini(apiKey, systemPrompt, messages) {
  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let lastError = "";
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (res.status === 404) { lastError = `Model ${model} not found`; continue; }
      if (res.status === 400) {
        // Some models don't support responseMimeType — retry without it
        const res2 = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
            }),
          }
        );
        if (!res2.ok) { lastError = `${model} ${res2.status}`; continue; }
        const data2 = await res2.json();
        const text2 = data2.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";
        if (text2) { console.log(`[creator] OK: ${model} (no mimeType)`); return { text: text2, model }; }
        continue;
      }
      if (!res.ok) { lastError = `${model} ${res.status}`; continue; }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.map(p => p.text ?? "").join("") ?? "";
      if (text) { console.log(`[creator] OK: ${model}`); return { text, model }; }
    } catch (e) {
      lastError = e.message;
    }
  }
  throw new Error(`No Gemini model worked. Last error: ${lastError}. Check your API key at aistudio.google.com`);
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
      return NextResponse.json(
        { error: "GEMINI_API_KEY not set. Add it in Vercel → Settings → Environment Variables." },
        { status: 500 }
      );
    }

    const systemPrompt = mode === "refine" ? REFINE_PROMPT : SYSTEM_PROMPT;
    const { text, model } = await callGemini(apiKey, systemPrompt, messages);

    return NextResponse.json({ text, model });
  } catch (err) {
    console.error("[creator] Error:", err?.message);
    return NextResponse.json({ error: err?.message || "Generation failed" }, { status: 500 });
  }
}

// Debug — GET /api/creator
export async function GET() {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";

  const keyStatus = apiKey ? `set (${apiKey.slice(0, 8)}...)` : "NOT SET";
  let models = [];

  if (apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();
      models = (data.models ?? []).map(m => m.name).filter(n => n.includes("gemini"));
    } catch (e) {
      models = [`Error: ${e.message}`];
    }
  }

  return NextResponse.json({ ai: "Gemini", keyStatus, availableModels: models });
}
