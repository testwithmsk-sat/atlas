/** @jsxImportSource react */
import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { buildAssetBinary, getGeneratedAssetById } from "@/lib/ai/assets";
import { customerHasPaidBundleAccess, getGenerationOrderByGatewayOrderId } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

function getMimeType(format) {
  if (format === "PDF") return "application/pdf";
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
    if (order?.sessionId === asset.sessionId && order.status === "paid") {
      return true;
    }
  }

  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  if (!email) return false;
  return customerHasPaidBundleAccess(asset.sessionId, email);
}

function PreviewCard({ session, asset }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #efe5cf 0%, #f7f3ea 52%, #d6e6df 100%)",
        color: "#17212f",
        padding: "56px",
        fontFamily: "Arial, sans-serif",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "78%" }}>
          <div style={{ fontSize: 28, letterSpacing: "0.14em", textTransform: "uppercase" }}>The Digital Atlas</div>
          <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 700 }}>{session.normalizedIntent.recommendedTitle}</div>
          <div style={{ fontSize: 28, lineHeight: 1.3 }}>{session.normalizedIntent.recommendedDescription}</div>
        </div>
        <div
          style={{
            display: "flex",
            padding: "14px 20px",
            borderRadius: 999,
            background: "#17212f",
            color: "#ffffff",
            fontSize: 24
          }}
        >
          {asset.isPaid ? "Full Bundle" : "Free Sample"}
        </div>
      </div>
      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
        {session.normalizedIntent.deliverables.slice(0, 4).map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              padding: "14px 18px",
              border: "2px solid rgba(23,33,47,0.16)",
              borderRadius: 18,
              fontSize: 24,
              background: "rgba(255,255,255,0.42)"
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function GET(request, { params }) {
  const { assetId } = await params;
  const asset = await getGeneratedAssetById(assetId);

  if (!asset) {
    return NextResponse.json({ error: "Generated asset not found." }, { status: 404 });
  }

  const session = await getGenerationSession(asset.sessionId);
  if (!session) {
    return NextResponse.json({ error: "The parent generation session could not be found." }, { status: 404 });
  }

  if (asset.isPaid) {
    const allowed = await canAccessPaidAsset(asset, request);
    if (!allowed) {
      return NextResponse.json({ error: "This premium asset is locked until the paid bundle is unlocked." }, { status: 403 });
    }
  }

  const disposition = request.nextUrl.searchParams.get("disposition");
  const contentDisposition = buildDisposition(asset.fileName, disposition);

  if (asset.format === "PNG") {
    const response = new ImageResponse(<PreviewCard session={session} asset={asset} />, {
      width: 1200,
      height: 675
    });
    response.headers.set("Content-Type", "image/png");
    response.headers.set("Content-Disposition", contentDisposition);
    return response;
  }

  const body = await buildAssetBinary(session, asset);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": getMimeType(asset.format),
      "Content-Disposition": contentDisposition
    }
  });
}
