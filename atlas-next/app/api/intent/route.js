import { NextResponse } from "next/server";
import { createIntentRecommendation } from "@/lib/ai/service";
import { ensureSampleAssets, buildAssetBinary } from "@/lib/ai/assets";
import { saveGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const maxDuration = 60;

// Pre-build and cache the PDF buffer in Supabase storage
async function prebuildSamplePdf(session, assets) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return; // no storage — lazy generation will handle it

  const pdfAsset = assets.find(a => a.format === "PDF" && !a.isPaid);
  if (!pdfAsset) return;

  try {
    const buffer = await buildAssetBinary(session, pdfAsset);
    if (!buffer || !buffer.length) return;

    // Store in Supabase storage so download is instant
    await supabase.storage
      .from(pdfAsset.storageBucket || "generated-assets")
      .upload(pdfAsset.storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true
      });
  } catch (err) {
    // Non-fatal — lazy generation will still work as fallback
    console.error("PDF prebuild failed:", err?.message);
  }
}

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const supabase = await createSupabaseServerClient();
    const userResult = supabase ? await supabase.auth.getUser() : null;
    const customerEmail = userResult?.data?.user?.email || "";

    const { response, session } = await createIntentRecommendation(payload, { customerEmail });
    await saveGenerationSession(session);

    let assets = [];
    if (session.sampleStatus === "ready") {
      assets = await ensureSampleAssets(session);
      // Fire-and-forget pre-build so PDF is ready immediately on workspace load
      prebuildSamplePdf(session, assets).catch(() => {});
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Intent generation failed." },
      { status: 400 }
    );
  }
}
