/** @jsxImportSource react */
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { buildAssetBinary, getGeneratedAssetById } from "@/lib/ai/assets";
import { customerHasPaidBundleAccess, getGenerationOrderByGatewayOrderId } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function getMimeType(format) {
  if (format === "PDF")  return "application/pdf";
  if (format === "DOCX") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (format === "XLSX") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  return "image/png";
}

function buildDisposition(fileName, requestedDisposition) {
  const disposition = requestedDisposition === "inline" ? "inline" : "attachment";
  return `${disposition}; filename="${fileName}"`;
}

async function canAccessPaidAsset(asset, request) {
  const orderId = request.nextUrl.searchParams.get("orderId") || "";
  if (orderId) {
    const order = await getGenerationOrderByGatewayOrderId(orderId);
    if (order?.sessionId === asset.sessionId && order.status === "paid") return true;
  }
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  if (!email) return false;
  return customerHasPaidBundleAccess(asset.sessionId, email);
}

// Try to serve from Supabase storage cache first
async function getFromStorage(asset) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from(asset.storageBucket || "generated-assets")
      .download(asset.storagePath);
    if (error || !data) return null;
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

function PreviewCard({ session, asset }) {
  return (
    <div style={{
      display: "flex", width: "100%", height: "100%",
      background: "linear-gradient(135deg, #1B2A4A 0%, #243659 60%, #1a3048 100%)",
      color: "#ffffff", padding: "56px", fontFamily: "Arial, sans-serif",
      flexDirection: "column", justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ fontSize: 18, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A84C" }}>
          The Digital Atlas
        </div>
        <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 700, maxWidth: "80%" }}>
          {session.normalizedIntent.recommendedTitle}
        </div>
        <div style={{ fontSize: 24, lineHeight: 1.4, color: "rgba(255,255,255,0.7)", maxWidth: "70%" }}>
          {session.normalizedIntent.recommendedDescription}
        </div>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {(session.normalizedIntent.deliverables || []).slice(0, 4).map((item) => (
          <div key={item} style={{
            display: "flex", padding: "12px 18px",
            border: "1px solid rgba(201,168,76,0.4)",
            borderRadius: 12, fontSize: 20, color: "#C9A84C",
            background: "rgba(201,168,76,0.1)"
          }}>
            {item}
          </div>
        ))}
        <div style={{
          display: "flex", padding: "12px 18px",
          background: "#C9A84C", borderRadius: 12,
          fontSize: 20, color: "#1B2A4A", fontWeight: 700
        }}>
          {asset.isPaid ? "Full Bundle" : "Free Sample"}
        </div>
      </div>
    </div>
  );
}

export async function GET(request, { params }) {
  const { assetId } = await params;
  const asset = await getGeneratedAssetById(assetId);

  if (!asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  const sessionToken = request.nextUrl.searchParams.get("t") || "";
  const { getOrRecoverSession } = await import("@/lib/ai/session-recovery");
  const session = await getOrRecoverSession(asset.sessionId, sessionToken);
  if (!session) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  if (asset.isPaid) {
    const allowed = await canAccessPaidAsset(asset, request);
    if (!allowed) {
      return NextResponse.json({ error: "This asset requires purchase." }, { status: 403 });
    }
  }

  const disposition = request.nextUrl.searchParams.get("disposition");
  const contentDisposition = buildDisposition(asset.fileName, disposition);

  // PNG preview — generate via OG image
  if (asset.format === "PNG") {
    const response = new ImageResponse(<PreviewCard session={session} asset={asset} />, { width: 1200, height: 675 });
    response.headers.set("Content-Type", "image/png");
    response.headers.set("Content-Disposition", contentDisposition);
    return response;
  }

  // Try cached version from storage first (fast)
  const cached = await getFromStorage(asset);
  if (cached && cached.length > 100) {
    return new NextResponse(cached, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(asset.format),
        "Content-Disposition": contentDisposition,
        "Cache-Control": "private, max-age=3600"
      }
    });
  }

  // Generate fresh via Claude + build document
  const body = await buildAssetBinary(session, asset);

  // Cache it for next time
  const supabaseAdmin = getSupabaseAdmin();
  if (supabaseAdmin && body?.length > 100) {
    supabaseAdmin.storage
      .from(asset.storageBucket || "generated-assets")
      .upload(asset.storagePath, body, { contentType: getMimeType(asset.format), upsert: true })
      .catch(() => {});
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": getMimeType(asset.format),
      "Content-Disposition": contentDisposition,
      "Cache-Control": "private, max-age=3600"
    }
  });
}
