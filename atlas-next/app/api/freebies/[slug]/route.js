import { NextResponse } from "next/server";
import { getFreebieDownloadUrl, buildStarterBriefContent } from "@/lib/ai/freebies";
import { getGenerationSession } from "@/lib/ai/sessions";
import { getProductBySlug } from "@/lib/catalog";

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.accessTier !== "free") {
    return NextResponse.json({ error: "Starter asset unavailable." }, { status: 404 });
  }

  const downloadUrl = await getFreebieDownloadUrl(slug);
  if (downloadUrl) {
    return NextResponse.redirect(downloadUrl);
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId");
  const session = sessionId ? await getGenerationSession(sessionId) : null;
  const body = buildStarterBriefContent({ product, session });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="${slug}-starter-brief.txt"`
    }
  });
}
