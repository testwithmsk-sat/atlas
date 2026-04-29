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

function buildAssetContent(session, asset) {
  const sections = [
    {
      heading: "Suggested Deliverables",
      items: session.normalizedIntent.deliverables
    },
    {
      heading: "Why This Fits",
      items: session.normalizedIntent.whyItFits
    }
  ];
  const summary = session.normalizedIntent.recommendedDescription;
  const title = session.normalizedIntent.recommendedTitle;

  if (asset.format === "PDF") {
    return buildPdfBuffer({
      title,
      summary,
      deliverables: session.normalizedIntent.deliverables,
      notes: session.normalizedIntent.whyItFits,
      callouts: asset.isPaid
        ? ["Use this full bundle as the editable master version.", "Return to your workspace for regenerations or new directions."]
        : ["Use this starter sample to confirm the direction before unlocking the full bundle."]
    });
  }

  if (asset.format === "DOCX") {
    return Promise.resolve(
      buildDocxBuffer({
        title,
        summary,
        sections
      })
    );
  }

  if (asset.format === "XLSX") {
    const rows = [
      ["Section", "Details"],
      ["Title", title],
      ["Audience", session.normalizedIntent.audienceProfile],
      ["Use Case", session.normalizedIntent.useCaseType],
      ["Style", session.normalizedIntent.styleDirection],
      ...session.normalizedIntent.deliverables.map((item, index) => [`Deliverable ${index + 1}`, item]),
      ...session.normalizedIntent.whyItFits.map((item, index) => [`Why ${index + 1}`, item])
    ];

    return Promise.resolve(
      buildXlsxBuffer({
        sheetName: "Generated Plan",
        rows
      })
    );
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
