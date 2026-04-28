import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getProductPreviewAsset } from "@/lib/product-preview-sources";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = await params;
  const requestUrl = new URL(request.url);
  const index = Number(requestUrl.searchParams.get("index") || 0);
  const previewAsset = getProductPreviewAsset(slug, index);

  if (!previewAsset) {
    return NextResponse.json({ error: "Preview source not found." }, { status: 404 });
  }

  if (previewAsset.publicUrl) {
    return NextResponse.redirect(new URL(previewAsset.publicUrl, requestUrl.origin), 307);
  }

  try {
    const supabase = getSupabaseAdmin();
    let pdfBytes = null;

    if (supabase && previewAsset.storagePath) {
      const downloadResult = await supabase.storage.from(env.supabaseDownloadsBucket).download(previewAsset.storagePath);

      if (!downloadResult.error && downloadResult.data) {
        pdfBytes = Buffer.from(await downloadResult.data.arrayBuffer());
      }
    }

    if (!pdfBytes && previewAsset.localPath) {
      pdfBytes = await fs.readFile(previewAsset.localPath);
    }

    if (!pdfBytes) {
      return NextResponse.json({ error: "The preview file is unavailable." }, { status: 500 });
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "The preview file could not be loaded." }, { status: 500 });
  }
}
