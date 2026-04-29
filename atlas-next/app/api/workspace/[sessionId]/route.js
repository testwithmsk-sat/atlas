import { NextResponse } from "next/server";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(_request, { params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Generation session not found." }, { status: 404 });
  }

  const assets = await listGeneratedAssetsForSession(sessionId);
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const customerEmail = userResult?.data?.user?.email || "";
  const hasPaidAccess = customerEmail ? await customerHasPaidBundleAccess(sessionId, customerEmail) : false;

  return NextResponse.json({
    sessionId: session.sessionId,
    prompt: session.prompt,
    normalizedIntent: session.normalizedIntent,
    templateFamily: session.templateFamily,
    suggestedOptions: session.suggestedOptions,
    sampleStatus: session.sampleStatus,
    bundleStatus: session.bundleStatus,
    paidBundleOffer: getPaidBundleOffer(session.templateFamily),
    sampleAssets: getSampleAssets(assets),
    bundleAssets: hasPaidAccess ? getBundleAssets(assets) : [],
    hasPaidAccess,
    createdAt: session.createdAt
  });
}
