import { NextResponse } from "next/server";
import { getFreebieDownloadUrl } from "@/lib/ai/freebies";
import { getGenerationSession } from "@/lib/ai/sessions";
import { getProductBySlug } from "@/lib/catalog";
import { buildAssetBinary } from "@/lib/ai/assets";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.accessTier !== "free") {
    return NextResponse.json({ error: "Starter asset unavailable." }, { status: 404 });
  }

  // Static file lookup always returns "" now — all freebies are AI-generated
  const downloadUrl = await getFreebieDownloadUrl(slug);
  if (downloadUrl) {
    return NextResponse.redirect(downloadUrl);
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId");
  const session = sessionId ? await getGenerationSession(sessionId) : null;

  // Build a synthetic session from the product catalog if no real session exists
  const syntheticSession = session || {
    sessionId: `freebie-${slug}`,
    templateFamily: product.categorySlug || "planner_or_checklist",
    normalizedIntent: {
      recommendedTitle: product.name || slug,
      recommendedDescription: product.summary || "A focused starter planning guide.",
      intentSummary: product.summary || "",
      useCaseType: product.categorySlug || "planning",
      audienceProfile: "Anyone planning this",
      styleDirection: "clean and professional",
      deliverables: product.features || [],
      whyItFits: [],
      nextSteps: []
    }
  };

  // Generate a real AI-powered PDF
  const asset = { format: "PDF", isPaid: false, fileName: `${slug}-starter-sample.pdf` };
  const body = await buildAssetBinary(syntheticSession, asset);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${slug}-starter-sample.pdf"`
    }
  });
}
