import { NextResponse } from "next/server";
import { createIntentRecommendation } from "@/lib/ai/service";
import { ensureSampleAssets } from "@/lib/ai/assets";
import { saveGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const supabase = await createSupabaseServerClient();
    const userResult = supabase ? await supabase.auth.getUser() : null;
    const customerEmail = userResult?.data?.user?.email || "";
    const { response, session } = await createIntentRecommendation(payload, { customerEmail });
    await saveGenerationSession(session);

    if (session.sampleStatus === "ready") {
      await ensureSampleAssets(session);
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Intent generation failed."
      },
      { status: 400 }
    );
  }
}
