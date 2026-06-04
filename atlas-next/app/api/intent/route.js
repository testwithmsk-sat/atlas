import { NextResponse } from "next/server";
import { createIntentRecommendation } from "@/lib/ai/service";
import { ensureSampleAssets, buildAssetBinary } from "@/lib/ai/assets";
import { saveGenerationSession } from "@/lib/ai/sessions";
import { encodeSessionToken } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const maxDuration = 60;

async function prebuildSamplePdf(session, assets) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const pdfAsset = assets.find(a => a.format === "PDF" && !a.isPaid);
  if (!pdfAsset) return;
  try {
    const buffer = await buildAssetBinary(session, pdfAsset);
    if (!buffer?.length) return;
    await supabase.storage
      .from(pdfAsset.storageBucket || "generated-assets")
      .upload(pdfAsset.storagePath, buffer, { contentType: "application/pdf", upsert: true });
  } catch (err) {
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
      prebuildSamplePdf(session, assets).catch(() => {});
    }

    // Always include session token so client can recover if Supabase lookup fails
    const sessionToken = encodeSessionToken(session);

    return NextResponse.json({ ...response, sessionToken });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Intent generation failed." },
      { status: 400 }
    );
  }
}
