import { getOutputFormatsForFamily } from "@/lib/ai/matcher";
import { generatedAssetSchema } from "@/lib/ai/schemas";
import { buildDocxBuffer, buildPdfBuffer, buildXlsxBuffer } from "@/lib/ai/documents";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getMemoryAssetsStore() {
  if (!globalThis.__atlasGeneratedAssets) {
    globalThis.__atlasGeneratedAssets = new Map();
  }

  return globalThis.__atlasGeneratedAssets;
}

function getMemoryAssetCounter() {
  if (!globalThis.__atlasGeneratedAssetCounter) {
    globalThis.__atlasGeneratedAssetCounter = 1;
  }

  return globalThis.__atlasGeneratedAssetCounter;
}

function incrementMemoryAssetCounter() {
  globalThis.__atlasGeneratedAssetCounter = getMemoryAssetCounter() + 1;
  return globalThis.__atlasGeneratedAssetCounter;
}

function slugify(value) {
  return String(value || "digital-atlas")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function buildStoragePath(sessionId, fileName) {
  return `${sessionId}/${fileName}`;
}

function ensureAssetShape(asset) {
  return generatedAssetSchema.parse({
    ...asset,
    storageBucket: asset.storageBucket || "generated-assets",
    createdAt: asset.createdAt || new Date().toISOString()
  });
}

function buildSampleAssetSpecs(session) {
  const baseSlug = slugify(session.normalizedIntent.recommendedTitle);

  return [
    {
      assetRole: "sample_preview",
      format: "PNG",
      fileName: `${baseSlug}-sample-preview.png`,
      isPaid: false
    },
    {
      assetRole: "sample_pdf",
      format: "PDF",
      fileName: `${baseSlug}-starter-sample.pdf`,
      isPaid: false
    }
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

async function generateAiContent(session, asset) {
  const intent = session.normalizedIntent;
  const isPaid = asset.isPaid;
  const format = asset.format;

  const systemPrompt = `You are a digital product content generator for The Digital Atlas. 
Your job is to generate real, useful, detailed content for digital planning documents based on a user's stated goal.
Always write content that is immediately actionable, specific to the user's intent, and feels professionally crafted.
Never use placeholder text. Never say "insert here" or "[your name]". Write as if this is the finished product.`;

  const userPrompt = isPaid
    ? `Generate full editable bundle content for this user intent:

Title: ${intent.recommendedTitle}
Goal: ${intent.intentSummary || intent.recommendedDescription}
Use case: ${intent.useCaseType}
Audience: ${intent.audienceProfile}
Style: ${intent.styleDirection}
Format type: ${format}
Deliverables to cover: ${(intent.deliverables || []).join(", ")}

${format === "PDF" ? `Write a complete, multi-section PDF document with:
- A clear introduction paragraph
- Detailed sections for each deliverable (3-5 bullet points each with real content)
- A timeline or checklist section with 8-12 specific actionable steps
- A tips and notes section with 4-6 practical insights
- A closing next steps section
Make it feel like a premium, professional planning guide.` : ""}
${format === "DOCX" ? `Write a structured Word document with:
- An executive summary paragraph
- Detailed sections for each deliverable with real content and sub-points
- An action plan table with tasks, owners, and timelines
- A notes and customization guide section
Format with clear headings and make it feel polished and editable.` : ""}
${format === "XLSX" ? `Return a JSON array of rows for a spreadsheet. Each row is an array of strings.
Include: header row, then data rows covering tasks, timelines, budgets, checklists, or tracking columns relevant to the intent.
Return ONLY a JSON array, no explanation. Example: [["Task","Owner","Due Date","Status"],["Book venue","You","Week 1","Pending"]]` : ""}

Respond with only the document content, no preamble.`
    : `Generate a free starter sample for this user intent:

Title: ${intent.recommendedTitle}
Goal: ${intent.intentSummary || intent.recommendedDescription}
Use case: ${intent.useCaseType}
Audience: ${intent.audienceProfile}

${format === "PDF" ? `Write a 1-page starter sample PDF with:
- A welcoming intro (2-3 sentences specific to their goal)
- 4-6 key planning steps with real, specific content (not generic)
- A "what's in the full bundle" teaser section listing 3-4 premium extras they'd get
- A motivating closing line
Keep it genuinely useful — not just a teaser, but a real first step.` : ""}

Respond with only the document content, no preamble.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: isPaid ? 2000 : 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });

    if (!response.ok) throw new Error(`Anthropic API error: ${response.status}`);
    const data = await response.json();
    return data.content?.[0]?.text || "";
  } catch {
    return "";
  }
}

async function buildAssetContent(session, asset) {
  const intent = session.normalizedIntent;
  const title = intent.recommendedTitle;
  const summary = intent.recommendedDescription;

  if (asset.format === "PDF") {
    const aiText = await generateAiContent(session, asset);

    // Parse AI text into structured sections for the PDF renderer
    const lines = (aiText || "").split("\n").filter(Boolean);
    const deliverables = [];
    const notes = [];
    const callouts = [];
    let section = "deliverables";

    for (const line of lines) {
      const clean = line.replace(/^[-•*\d.]+\s*/, "").trim();
      if (!clean) continue;
      if (/what.s in the full|full bundle|premium|unlock/i.test(clean)) { section = "callouts"; continue; }
      if (/tip|note|insight|remem|keep in mind/i.test(clean) && clean.length < 60) { section = "notes"; continue; }
      if (section === "deliverables") deliverables.push(clean);
      else if (section === "notes") notes.push(clean);
      else callouts.push(clean);
    }

    return buildPdfBuffer({
      title,
      summary,
      deliverables: deliverables.length ? deliverables : (intent.deliverables || []),
      notes: notes.length ? notes : (intent.whyItFits || []),
      callouts: callouts.length ? callouts : (
        asset.isPaid
          ? ["Use this full bundle as your editable master version.", "Return to your workspace for regenerations or new directions."]
          : ["Use this starter sample to confirm the direction before unlocking the full bundle."]
      )
    });
  }

  if (asset.format === "DOCX") {
    const aiText = await generateAiContent(session, asset);
    const lines = (aiText || "").split("\n").filter(Boolean);
    const sections = [];
    let currentSection = null;

    for (const line of lines) {
      if (/^#{1,3}\s/.test(line) || (line.length < 60 && !line.startsWith("-") && !line.startsWith("•"))) {
        if (currentSection) sections.push(currentSection);
        currentSection = { heading: line.replace(/^#+\s*/, "").trim(), items: [] };
      } else if (currentSection) {
        const clean = line.replace(/^[-•*]\s*/, "").trim();
        if (clean) currentSection.items.push(clean);
      }
    }
    if (currentSection) sections.push(currentSection);

    return Promise.resolve(buildDocxBuffer({
      title,
      summary,
      sections: sections.length ? sections : [
        { heading: "Suggested Deliverables", items: intent.deliverables || [] },
        { heading: "Why This Fits", items: intent.whyItFits || [] }
      ]
    }));
  }

  if (asset.format === "XLSX") {
    const aiText = await generateAiContent(session, asset);
    let rows = [];

    try {
      const jsonMatch = aiText.match(/\[[\s\S]*\]/);
      if (jsonMatch) rows = JSON.parse(jsonMatch[0]);
    } catch {
      // fallback rows
    }

    if (!rows.length) {
      rows = [
        ["Section", "Details"],
        ["Title", title],
        ["Audience", intent.audienceProfile || ""],
        ["Use Case", intent.useCaseType || ""],
        ["Style", intent.styleDirection || ""],
        ...(intent.deliverables || []).map((item, i) => [`Deliverable ${i + 1}`, item]),
        ...(intent.whyItFits || []).map((item, i) => [`Why ${i + 1}`, item])
      ];
    }

    return Promise.resolve(buildXlsxBuffer({ sheetName: "Generated Plan", rows }));
  }

  return Promise.resolve(Buffer.from(""));
}

function toDatabaseAssetRecord(asset) {
  return {
    session_id: asset.sessionId,
    asset_role: asset.assetRole,
    format: asset.format,
    file_name: asset.fileName,
    storage_bucket: asset.storageBucket,
    storage_path: asset.storagePath,
    is_paid: asset.isPaid
  };
}

function fromDatabaseRow(row) {
  return ensureAssetShape({
    id: row.id,
    sessionId: row.session_id,
    assetRole: row.asset_role,
    format: row.format,
    fileName: row.file_name,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    isPaid: Boolean(row.is_paid),
    createdAt: row.created_at
  });
}

export async function listGeneratedAssetsForSession(sessionId) {
  if (!sessionId) return [];

  const memoryAssets = [...getMemoryAssetsStore().values()].filter((asset) => asset.sessionId === sessionId);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return memoryAssets.sort((left, right) => String(left.id).localeCompare(String(right.id)));
  }

  const { data, error } = await supabase
    .from("generated_assets")
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return memoryAssets.sort((left, right) => String(left.id).localeCompare(String(right.id)));
  }

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

  const { data, error } = await supabase
    .from("generated_assets")
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at")
    .eq("id", Number(assetId))
    .single();

  if (error || !data) return null;

  const asset = fromDatabaseRow(data);
  getMemoryAssetsStore().set(String(asset.id), asset);
  return asset;
}

async function saveGeneratedAssets(sessionId, assetSpecs) {
  const supabase = getSupabaseAdmin();
  const storedAssets = assetSpecs.map((spec) => {
    const id = spec.id || getMemoryAssetCounter();
    if (!spec.id) {
      incrementMemoryAssetCounter();
    }

    return ensureAssetShape({
      id,
      sessionId,
      assetRole: spec.assetRole,
      format: spec.format,
      fileName: spec.fileName,
      storageBucket: "generated-assets",
      storagePath: buildStoragePath(sessionId, spec.fileName),
      isPaid: spec.isPaid
    });
  });

  storedAssets.forEach((asset) => {
    getMemoryAssetsStore().set(String(asset.id), asset);
  });

  if (!supabase) return storedAssets;

  const { data, error } = await supabase
    .from("generated_assets")
    .upsert(storedAssets.map(toDatabaseAssetRecord), { onConflict: "session_id,storage_path" })
    .select("id, session_id, asset_role, format, file_name, storage_bucket, storage_path, is_paid, created_at");

  if (error || !data) {
    return storedAssets;
  }

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

export function getSampleAssets(assets) {
  return (assets || []).filter((asset) => asset.isPaid === false);
}

export function getBundleAssets(assets) {
  return (assets || []).filter((asset) => asset.isPaid === true);
}

export async function buildAssetBinary(session, asset) {
  return buildAssetContent(session, asset);
}
