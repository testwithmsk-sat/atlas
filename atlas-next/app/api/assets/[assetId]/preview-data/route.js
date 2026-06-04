import { NextResponse } from "next/server";
import { getGeneratedAssetById } from "@/lib/ai/assets";
import { getOrRecoverSession } from "@/lib/ai/session-recovery";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const CACHE = new Map(); // in-memory cache keyed by assetId

async function generatePreviewContent(session) {
  const intent = session.normalizedIntent;
  const prompt = session.prompt || "";

  const system = `You are a digital product content generator for The Digital Atlas.
Generate structured JSON content for a product preview. Be SPECIFIC to the user's actual request.
Never use placeholder text. Return ONLY valid JSON.`;

  const userPrompt = `Generate preview content for this digital product:

User's request: "${prompt}"
Product title: ${intent.recommendedTitle}
Goal: ${intent.intentSummary || intent.recommendedDescription}
Use case: ${intent.useCaseType}
Audience: ${intent.audienceProfile}
Deliverables: ${(intent.deliverables || []).join(", ")}

Return this JSON structure with REAL, SPECIFIC content (not generic filler):
{
  "title": "${intent.recommendedTitle}",
  "intro": "2 sentences specific to their goal",
  "sections": [
    {
      "heading": "Section matching first deliverable",
      "icon": "relevant emoji",
      "body": "1 sentence about this section",
      "items": ["Specific item 1", "Specific item 2", "Specific item 3", "Specific item 4", "Specific item 5"]
    }
  ],
  "timeline": {
    "heading": "Step-by-step action plan",
    "steps": [
      { "phase": "Week 1", "task": "Specific task", "detail": "Helpful tip" },
      { "phase": "Week 2", "task": "Specific task", "detail": "Helpful tip" }
    ]
  },
  "xlsxRows": [
    ["Task", "Owner", "Timeline", "Budget", "Status"],
    ["Real task 1", "You", "Week 1", "$500", "Pending"],
    ["Real task 2", "You", "Week 2", "$200", "Pending"]
  ]
}

Create 3-4 sections. 10-12 timeline steps. 8-12 xlsx rows. All specific to their goal.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      system,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON");
  return JSON.parse(match[0]);
}

async function getCachedContent(assetId, session) {
  // 1. Memory cache
  if (CACHE.has(assetId)) return CACHE.get(assetId);

  // 2. Supabase cache
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const path = `${session.sessionId}/preview-${assetId}.json`;
      const { data } = await supabase.storage.from("generated-assets").download(path);
      if (data) {
        const json = JSON.parse(await data.text());
        CACHE.set(assetId, json);
        return json;
      }
    } catch {}
  }

  // 3. Generate fresh
  const content = await generatePreviewContent(session);
  CACHE.set(assetId, content);

  // Cache in Supabase
  if (supabase) {
    try {
      const path = `${session.sessionId}/preview-${assetId}.json`;
      await supabase.storage.from("generated-assets").upload(
        path,
        Buffer.from(JSON.stringify(content), "utf8"),
        { contentType: "application/json", upsert: true }
      );
    } catch {}
  }

  return content;
}

export async function GET(request, { params }) {
  const { assetId } = await params;
  const token = request.nextUrl.searchParams.get("t") || "";

  const asset = await getGeneratedAssetById(assetId);
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await getOrRecoverSession(asset.sessionId, token);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  try {
    const content = await getCachedContent(assetId, session);
    return NextResponse.json(content, {
      headers: { "Cache-Control": "private, max-age=3600" }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
