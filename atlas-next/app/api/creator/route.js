import { NextResponse } from "next/server";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a digital product planning AI for The Digital Atlas.
Given a user's goal, generate a complete, specific digital product direction.

RULES:
- Be HIGHLY SPECIFIC to the user's actual request — use their event, guest count, timeline, budget
- Never use placeholder text. Every item must be real and immediately useful.
- summary must be plain text only — NO JSON, NO curly braces
- Return ONLY valid JSON, no markdown fences, no explanation

Return this exact JSON:
{
  "title": "Specific product title using their details (max 9 words)",
  "description": "2 warm, specific sentences about what this product covers for their exact goal.",
  "formats": ["PDF", "XLSX", "DOCX"],
  "summary": "150-word plain-text planning direction. Warm expert tone. 3 concrete recommendations specific to their goal. NO JSON here — plain sentences only.",
  "samples": [
    {"emoji":"📋","name":"Specific document name","desc":"What this document contains for their goal"},
    {"emoji":"💰","name":"Specific document name","desc":"What this document contains"},
    {"emoji":"📅","name":"Specific document name","desc":"What this document contains"},
    {"emoji":"✉️","name":"Specific document name","desc":"What this document contains"}
  ],
  "preview": {
    "checklist": [
      "Specific actionable task 1 for their exact goal",
      "Specific actionable task 2",
      "Specific actionable task 3",
      "Specific actionable task 4",
      "Specific actionable task 5",
      "Specific actionable task 6",
      "Specific actionable task 7",
      "Specific actionable task 8"
    ],
    "timeline": [
      {"phase": "Week 1", "task": "Specific task for their goal", "detail": "Actionable tip"},
      {"phase": "Week 2", "task": "Specific task", "detail": "Actionable tip"},
      {"phase": "Week 4", "task": "Specific task", "detail": "Actionable tip"},
      {"phase": "Week 6", "task": "Specific task", "detail": "Actionable tip"},
      {"phase": "Week 8", "task": "Specific task", "detail": "Actionable tip"},
      {"phase": "2 Weeks Before", "task": "Specific task", "detail": "Actionable tip"},
      {"phase": "Day Before", "task": "Final preparation task", "detail": "Tip"},
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

const REFINE_PROMPT = "You are a helpful planning assistant. Write warm, specific, actionable summaries. Plain text only. No JSON.";

async function callClaude(systemPrompt, messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set in Vercel environment variables.");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "";
}

export async function POST(request) {
  try {
    const { messages, mode } = await request.json();
    const systemPrompt = mode === "refine" ? REFINE_PROMPT : SYSTEM_PROMPT;
    const text = await callClaude(systemPrompt, messages);
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[creator] Error:", err?.message);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// Debug — visit /api/creator in browser
export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  return NextResponse.json({
    ai: "Claude (claude-sonnet-4-20250514)",
    keyStatus: apiKey ? `set (${apiKey.slice(0, 8)}...)` : "NOT SET — add ANTHROPIC_API_KEY to Vercel env vars"
  });
}
