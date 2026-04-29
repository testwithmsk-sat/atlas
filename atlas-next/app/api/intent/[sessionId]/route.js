import { NextResponse } from "next/server";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { getGenerationSession } from "@/lib/ai/sessions";

export async function GET(_request, { params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Generation session not found." }, { status: 404 });
  }

  const assets = await listGeneratedAssetsForSession(sessionId);

  return NextResponse.json({
    sessionId: session.sessionId,
    normalizedIntent: session.normalizedIntent,
    templateFamily: session.templateFamily,
    suggestedOptions: session.suggestedOptions,
    sampleStatus: session.sampleStatus,
    bundleStatus: session.bundleStatus,
    paidBundleOffer: getPaidBundleOffer(session.templateFamily),
    sampleAssets: getSampleAssets(assets),
    bundleAssets: getBundleAssets(assets),
    createdAt: session.createdAt
  });
}
