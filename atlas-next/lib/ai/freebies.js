import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function getFreebieDownloadUrl(productSlug) {
  if (!productSlug) return "";

  const supabase = getSupabaseAdmin();
  if (!supabase) return "";

  const { data, error } = await supabase
    .from("download_files")
    .select("file_url, storage_bucket, storage_path, access_mode, sort_order")
    .eq("product_slug", productSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (error || !data?.length) return "";

  const file = data[0];
  if (file.access_mode === "signed" && file.storage_path) {
    const bucket = file.storage_bucket || env.supabaseDownloadsBucket;
    const signedUrlResult = await supabase.storage.from(bucket).createSignedUrl(file.storage_path, env.supabaseSignedUrlExpiresIn);
    return signedUrlResult.data?.signedUrl || "";
  }

  return file.file_url || "";
}

export function buildStarterBriefContent({ product, session }) {
  const normalizedIntent = session?.normalizedIntent || {};
  const deliverables = Array.isArray(normalizedIntent.deliverables) ? normalizedIntent.deliverables : [];
  const reasoningNotes = Array.isArray(normalizedIntent.reasoningNotes) ? normalizedIntent.reasoningNotes : [];
  const nextSteps = Array.isArray(normalizedIntent.nextSteps) ? normalizedIntent.nextSteps : [];

  return [
    "The Digital Atlas Starter Brief",
    "",
    `Idea: ${normalizedIntent.productIdeaTitle || product?.name || "Starter kit"}`,
    `Category: ${session?.categorySlug || product?.categorySlug || "wedding"}`,
    "",
    normalizedIntent.intentSummary || product?.summary || "A focused starter recommendation from your AI planning flow.",
    "",
    "Suggested deliverables:",
    ...deliverables.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Why this fits:",
    ...reasoningNotes.map((item, index) => `${index + 1}. ${item}`),
    "",
    "Next steps:",
    ...nextSteps.map((item, index) => `${index + 1}. ${item}`)
  ].join("\n");
}
