import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { getEditorSourceEntry } from "@/lib/editor-source-manifest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { slug } = await params;
  const sourceEntry = getEditorSourceEntry(slug);

  if (!sourceEntry) {
    return NextResponse.json({ error: "Editor source not found." }, { status: 404 });
  }

  try {
    const pdfBytes = await fs.readFile(sourceEntry.localPath);

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
