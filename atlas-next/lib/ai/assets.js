import { getOutputFormatsForFamily } from "@/lib/ai/matcher";
import { generatedAssetSchema } from "@/lib/ai/schemas";
import { buildDocxBuffer, buildPdfBuffer, buildXlsxBuffer } from "@/lib/ai/documents";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getMemoryAssetsStore() {
  if (!globalThis.__atlasGeneratedAssets) globalThis.__atlasGeneratedAssets = new Map();
  return globalThis.__atlasGeneratedAssets;
}
function getMemoryAssetCounter() {
  if (!globalThis.__atlasGeneratedAssetCounter) globalThis.__atlasGeneratedAssetCounter = 1;
  return globalThis.__atlasGeneratedAssetCounter;
}
function incrementMemoryAssetCounter() {
  globalThis.__atlasGeneratedAssetCounter = getMemoryAssetCounter() + 1;
  return globalThis.__atlasGeneratedAssetCounter;
}
function slugify(value) {
  return String(value || "digital-atlas").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function buildStoragePath(sessionId, fileName) { return `${sessionId}/${fileName}`; }
function ensureAssetShape(asset) {
  return generatedAssetSchema.parse({ ...asset, storageBucket: asset.storageBucket || "generated-assets", createdAt: asset.createdAt || new Date().toISOString() });
}
function buildSampleAssetSpecs(session) {
  const baseSlug = slugify(session.normalizedIntent.recommendedTitle);
  return [
    { assetRole: "sample_preview", format: "PNG", fileName: `${baseSlug}-sample-preview.png`, isPaid: false },
    { assetRole: "sample_pdf", format: "PDF", fileName: `${baseSlug}-starter-sample.pdf`, isPaid: false }
  ];
}
function buildBundleAssetSpecs(session) {
  const baseSlug = slugify(session.normalizedIntent.recommendedTitle);
  return getOutputFormatsForFamily(session.templateFamily, session.normalizedIntent).map((format) => ({
    assetRole: `bundle_${format.toLowerCase()}`,
    format,
    fileName: `${baseSlug}-full-bundle.${format.toLowerCase()}`,
    isPaid: true
  }));
}

// ── Powerful AI content generation ───────────────────────────────────────────
async function callClaude(prompt, system, maxTokens = 3000) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const data = await response.json();
  return data.content?.[0]?.text || "";
}

async function generateStructuredContent(session, isPaid) {
  const intent = session.normalizedIntent;
  const originalPrompt = session.prompt || "";

  const system = `You are an expert digital product creator for The Digital Atlas — a premium AI-powered digital product generator.

You create REAL, COMPLETE, IMMEDIATELY USABLE planning documents. Never use placeholders like [Your Name], [Insert Here], or TBD.
Every bullet point must be a concrete action someone can do TODAY.
Be specific to the user's actual situation — mention their event type, guest count, timeline, audience wherever relevant.
Match tone to use case: warm for weddings, professional for business, energetic for events, calming for personal planning.

Return ONLY valid JSON. No markdown, no explanation outside the JSON.`;

  const prompt = isPaid
    ? `Create a COMPLETE, PREMIUM digital planning guide as JSON.

User's request: "${originalPrompt}"
Title: ${intent.recommendedTitle}
Goal: ${intent.intentSummary || intent.recommendedDescription}
Use case: ${intent.useCaseType || "planning"}
Audience: ${intent.audienceProfile || "the user"}
Style: ${intent.styleDirection || "clean and professional"}
Key deliverables: ${(intent.deliverables || []).join(", ")}

Return this exact JSON structure (fill every field with real, specific content — no generic filler):
{
  "title": "...",
  "subtitle": "A complete planning guide tailored to your exact goal",
  "intro": "2-3 sentences welcoming the reader and summarising exactly what this premium guide covers. Be warm and specific.",
  "sections": [
    {
      "heading": "Section name matching one deliverable",
      "icon": "single emoji representing this section",
      "body": "1-2 sentence overview of this section",
      "items": [
        "Concrete actionable bullet 1 — specific and detailed",
        "Concrete actionable bullet 2 — with real details/numbers",
        "Concrete actionable bullet 3",
        "Concrete actionable bullet 4",
        "Concrete actionable bullet 5",
        "Concrete actionable bullet 6"
      ]
    }
  ],
  "timeline": {
    "heading": "Your Step-by-Step Action Plan",
    "steps": [
      { "phase": "Phase label e.g. 8 Weeks Before", "task": "Specific task", "detail": "Extra detail or tip" },
      { "phase": "...", "task": "...", "detail": "..." }
    ]
  },
  "tips": {
    "heading": "Insider Tips & Tricks",
    "items": [
      "Specific insider tip 1 with real advice",
      "Specific insider tip 2",
      "Specific insider tip 3",
      "Specific insider tip 4",
      "Specific insider tip 5"
    ]
  },
  "nextSteps": [
    "First concrete next step",
    "Second concrete next step",
    "Third concrete next step"
  ]
}

IMPORTANT: Create 4-6 sections, one per major deliverable. Include 12-16 timeline steps. Make everything specific to the user's actual goal.`

    : `Create a FREE STARTER SAMPLE as JSON. It must be genuinely useful on its own while showing the full bundle is worth it.

User's request: "${originalPrompt}"
Title: ${intent.recommendedTitle}
Goal: ${intent.intentSummary || intent.recommendedDescription}
Use case: ${intent.useCaseType || "planning"}
Audience: ${intent.audienceProfile || "the user"}

Return this exact JSON structure:
{
  "title": "...",
  "subtitle": "Your free starter guide",
  "intro": "2 sentences welcoming the reader — warm, specific to their goal, make them feel understood",
  "sections": [
    {
      "heading": "Getting Started: Your First 5 Steps",
      "icon": "🗺️",
      "body": "Here's what to focus on first:",
      "items": [
        "Specific step 1 — actionable and real",
        "Specific step 2",
        "Specific step 3",
        "Specific step 4",
        "Specific step 5"
      ]
    },
    {
      "heading": "Quick Wins for This Week",
      "icon": "⚡",
      "body": "Do these in the next 24-48 hours:",
      "items": [
        "Quick win 1 — something they can do RIGHT NOW",
        "Quick win 2",
        "Quick win 3"
      ]
    }
  ],
  "bundleTeaser": {
    "heading": "Unlock Your Full Bundle",
    "body": "This starter guide gives you the foundation. Your full bundle includes:",
    "items": [
      "Specific premium item 1 that's genuinely enticing",
      "Specific premium item 2",
      "Specific premium item 3",
      "Specific premium item 4"
    ]
  },
  "nextSteps": [
    "First thing to do after reading this",
    "Second thing",
    "Third thing"
  ]
}`;

  const raw = await callClaude(prompt, system, isPaid ? 4000 : 2000);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in Claude response");
  return JSON.parse(match[0]);
}

async function generateXlsxContent(session) {
  const intent = session.normalizedIntent;
  const originalPrompt = session.prompt || "";

  const system = `You are a spreadsheet expert creating practical planning trackers. Return ONLY a JSON array of rows. No explanation. No markdown fences.`;

  const prompt = `Create a detailed, pre-filled spreadsheet tracker for this goal:

User's request: "${originalPrompt}"
Title: ${intent.recommendedTitle}
Use case: ${intent.useCaseType || "planning"}
Deliverables: ${(intent.deliverables || []).join(", ")}

Rules:
- First row: column headers (make them descriptive and useful)
- Include 20-30 data rows pre-filled with REAL, specific content relevant to this goal
- If budget tracker: include real cost categories with realistic price ranges
- If task planner: include real tasks with specific timeframes
- If checklist: group items by phase/category
- Make it immediately useful — someone should be able to open this and start using it TODAY

Return ONLY the JSON array. Example format:
[["Task","Owner","Timeline","Budget","Status","Notes"],["Book venue","Couple","12 weeks before","$2,000-5,000","Not Started","Get 3 quotes minimum"]]`;

  const raw = await callClaude(prompt, system, 2500);
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) return null;
  return JSON.parse(match[0]);
}

// ── Document builders using structured AI content ─────────────────────────────
async function buildAssetContent(session, asset) {
  const intent = session.normalizedIntent;
  const title = intent.recommendedTitle;
  const summary = intent.recommendedDescription;

  if (asset.format === "PDF") {
    try {
      const content = await generateStructuredContent(session, asset.isPaid);

      // Build rich sections from structured content
      const deliverables = [];
      const notes = [];
      const callouts = [];

      // Add intro
      if (content.intro) deliverables.push(content.intro);

      // Add section items
      for (const section of (content.sections || [])) {
        deliverables.push(`── ${section.heading} ${section.icon || ""}`);
        for (const item of (section.items || [])) deliverables.push(item);
      }

      // Timeline steps → notes
      if (content.timeline?.steps) {
        for (const step of content.timeline.steps) {
          notes.push(`${step.phase}: ${step.task}${step.detail ? ` — ${step.detail}` : ""}`);
        }
      }

      // Tips → notes
      if (content.tips?.items) {
        for (const tip of content.tips.items) notes.push(tip);
      }

      // Bundle teaser or next steps → callouts
      const ctas = content.bundleTeaser?.items || content.nextSteps || [];
      for (const cta of ctas) callouts.push(cta);

      return buildPdfBuffer({ title, summary, deliverables, notes, callouts });
    } catch {
      // Fallback to intent data
      return buildPdfBuffer({
        title, summary,
        deliverables: intent.deliverables || [],
        notes: intent.whyItFits || [],
        callouts: asset.isPaid
          ? ["Use this as your editable master version.", "Return to your workspace for new directions."]
          : ["Download the full bundle for complete editable files."]
      });
    }
  }

  if (asset.format === "DOCX") {
    try {
      const content = await generateStructuredContent(session, true);
      const sections = (content.sections || []).map(s => ({
        heading: `${s.icon || ""} ${s.heading}`.trim(),
        items: s.items || []
      }));
      if (content.timeline?.steps?.length) {
        sections.push({
          heading: content.timeline.heading || "Action Plan",
          items: content.timeline.steps.map(s => `${s.phase}: ${s.task}${s.detail ? ` — ${s.detail}` : ""}`)
        });
      }
      if (content.tips?.items?.length) {
        sections.push({ heading: content.tips.heading || "Tips & Insights", items: content.tips.items });
      }
      if (content.nextSteps?.length) {
        sections.push({ heading: "Next Steps", items: content.nextSteps });
      }
      return buildDocxBuffer({ title: content.title || title, summary: content.intro || summary, sections });
    } catch {
      return buildDocxBuffer({
        title, summary,
        sections: [
          { heading: "Deliverables", items: intent.deliverables || [] },
          { heading: "Why This Fits", items: intent.whyItFits || [] }
        ]
      });
    }
  }

  if (asset.format === "XLSX") {
    try {
      const rows = await generateXlsxContent(session);
      if (rows?.length) return buildXlsxBuffer({ sheetName: title.slice(0, 30), rows });
    } catch {}
    // Fallback
    return buildXlsxBuffer({
      sheetName: "Plan",
      rows: [
        ["Section", "Details", "Status", "Notes"],
        ["Title", title, "Active", ""],
        ...(intent.deliverables || []).map((item, i) => [`Deliverable ${i + 1}`, item, "Pending", ""])
      ]
    });
  }

  return Buffer.from("");
}

function toDatabaseAssetRecord(asset) {
  return {
    session_id: asset.sessionId, asset_role: asset.assetRole, format: asset.format,
    file_name: asset.fileName, storage_bucket: asset.storageBucket,
    storage_path: asset.storagePath, is_paid: asset.isPaid
  };
}
function fromDatabaseRow(row) {
  return ensureAssetShape({
    id: row.id, sessionId: row.session_id, assetRole: row.asset_role, format: row.format,
    fileName: row.file_name, storageBucket: row.storage_bucket, storagePath: row.storage_path,
    isPaid: Boolean(row.is_paid), createdAt: row.created_at
  });
}

export async function listGeneratedAssetsForSession(sessionId) {
  if (!sessionId) return [];
  const memoryAssets = [...getMemoryAssetsStore().values()].filter((asset) => asset.sessionId === sessionId);
  const supabase = getSupabaseAdmin();
  if (!supabase) return memoryAssets.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const { data, error } = await supabase.from("generated_assets")
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at")
    .eq("session_id", sessionId).order("created_at", { ascending: true });
  if (error || !data) return memoryAssets.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const assets = data.map(fromDatabaseRow);
  assets.forEach((asset) => getMemoryAssetsStore().set(String(asset.id), asset));
  return assets;
}

export async function getGeneratedAssetById(assetId) {
  if (!assetId && assetId !== 0) return null;
  const key = String(assetId);
  const memoryMatch = getMemoryAssetsStore().get(key);
  if (memoryMatch) return memoryMatch;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from("generated_assets")
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at")
    .eq("id", Number(assetId)).single();
  if (error || !data) return null;
  const asset = fromDatabaseRow(data);
  getMemoryAssetsStore().set(String(asset.id), asset);
  return asset;
}

async function saveGeneratedAssets(sessionId, assetSpecs) {
  const supabase = getSupabaseAdmin();
  const storedAssets = assetSpecs.map((spec) => {
    const id = spec.id || getMemoryAssetCounter();
    if (!spec.id) incrementMemoryAssetCounter();
    return ensureAssetShape({
      id, sessionId, assetRole: spec.assetRole, format: spec.format, fileName: spec.fileName,
      storageBucket: "generated-assets", storagePath: buildStoragePath(sessionId, spec.fileName), isPaid: spec.isPaid
    });
  });
  storedAssets.forEach((asset) => getMemoryAssetsStore().set(String(asset.id), asset));
  if (!supabase) return storedAssets;
  const { data, error } = await supabase.from("generated_assets")
    .upsert(storedAssets.map(toDatabaseAssetRecord), { onConflict: "session_id,storage_path" })
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at");
  if (error || !data) return storedAssets;
  const assets = data.map(fromDatabaseRow);
  assets.forEach((asset) => getMemoryAssetsStore().set(String(asset.id), asset));
  return assets;
}

export async function ensureSampleAssets(session) {
  const existing = await listGeneratedAssetsForSession(session.sessionId);
  const existingSample = existing.filter((asset) => asset.isPaid === false);
  if (existingSample.length >= 2) return existingSample;
  return saveGeneratedAssets(session.sessionId, buildSampleAssetSpecs(session));
}

export async function ensureBundleAssets(session) {
  const existing = await listGeneratedAssetsForSession(session.sessionId);
  const existingPaid = existing.filter((asset) => asset.isPaid === true);
  const expectedPaid = buildBundleAssetSpecs(session);
  if (existingPaid.length >= expectedPaid.length) return existingPaid;
  return saveGeneratedAssets(session.sessionId, expectedPaid);
}

export function getSampleAssets(assets) { return (assets || []).filter((asset) => asset.isPaid === false); }
export function getBundleAssets(assets) { return (assets || []).filter((asset) => asset.isPaid === true); }
export async function buildAssetBinary(session, asset) { return buildAssetContent(session, asset); }
