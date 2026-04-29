import { NextResponse } from "next/server";
import { ensureSampleAssets, getSampleAssets } from "@/lib/ai/assets";
import { saveGenerationSession, getGenerationSession } from "@/lib/ai/sessions";

export async function POST(request, { params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: "Generation session not found." }, { status: 404 });
  }

  const payload = await request.json().catch(() => ({}));
  const optionId = typeof payload?.optionId === "string" ? payload.optionId : "";
  let nextSession = session;

  if (optionId) {
    const selectedOption = session.suggestedOptions.find((option) => option.id === optionId);
    if (!selectedOption) {
      return NextResponse.json({ error: "That suggested direction is no longer available." }, { status: 400 });
    }

    nextSession = {
      ...session,
      templateFamily: selectedOption.templateFamily,
      sampleStatus: "ready",
      normalizedIntent: {
        ...session.normalizedIntent,
        recommendedTitle: selectedOption.title,
        recommendedDescription: selectedOption.description,
        templateFamily: selectedOption.templateFamily,
        scopeStatus: "clear"
      }
    };
    await saveGenerationSession(nextSession);
  }

  const assets = await ensureSampleAssets(nextSession);

  return NextResponse.json({
    ok: true,
    sessionId: nextSession.sessionId,
    templateFamily: nextSession.templateFamily,
    sampleStatus: nextSession.sampleStatus,
    sampleAssets: getSampleAssets(assets)
  });
}
