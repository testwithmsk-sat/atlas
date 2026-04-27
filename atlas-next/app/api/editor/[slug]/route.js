import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { getEditorSourceEntry } from "@/lib/editor-source-manifest";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const sourceEntry = getEditorSourceEntry(slug);

  if (!sourceEntry) {
    return NextResponse.json({ error: "Editor source not found." }, { status: 404 });
  }

  try {
    const supabase = getSupabaseAdmin();
    let pdfBytes = null;

    if (supabase && sourceEntry.storagePath) {
      const downloadResult = await supabase.storage.from(env.supabaseDownloadsBucket).download(sourceEntry.storagePath);

      if (!downloadResult.error && downloadResult.data) {
        pdfBytes = Buffer.from(await downloadResult.data.arrayBuffer());
      }
    }

    if (!pdfBytes && sourceEntry.localPath) {
      pdfBytes = await fs.readFile(sourceEntry.localPath);
    }

    if (!pdfBytes) {
      return NextResponse.json({ error: "The editor source file is unavailable." }, { status: 500 });
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
    return NextResponse.json({ error: "The editor source file could not be loaded." }, { status: 500 });
  }
}
