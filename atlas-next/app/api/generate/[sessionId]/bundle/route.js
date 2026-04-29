import { NextResponse } from "next/server";
import { ensureBundleAssets, getBundleAssets } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { saveGenerationSession, getGenerationSession } from "@/lib/ai/sessions";

export async function POST(_request, { params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Generation session not found." }, { status: 404 });
  }

  const assets = await ensureBundleAssets(session);
  const nextSession = session.bundleStatus === "ready" || session.bundleStatus === "paid"
    ? session
    : { ...session, bundleStatus: "ready" };

  if (nextSession !== session) {
    await saveGenerationSession(nextSession);
  }

  return NextResponse.json({
    ok: true,
    sessionId: nextSession.sessionId,
    bundleStatus: nextSession.bundleStatus,
    paidBundleOffer: getPaidBundleOffer(nextSession.templateFamily),
    bundleAssets: getBundleAssets(assets)
  });
}
