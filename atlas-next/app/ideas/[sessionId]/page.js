import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkspaceSessionClient } from "@/components/workspace-session-client";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId).catch(() => null);
  return {
    title: session?.normalizedIntent?.recommendedTitle
      ? `${session.normalizedIntent.recommendedTitle} — The Digital Atlas`
      : "Your AI Digital Product — The Digital Atlas",
    description: session?.normalizedIntent?.recommendedDescription || "AI-generated digital product for your goal.",
    robots: { index: false, follow: false }
  };
}

export default async function IdeaSessionPage({ params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);
  if (!session) notFound();

  const assets = await listGeneratedAssetsForSession(sessionId);
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  const hasPaidAccess = email ? await customerHasPaidBundleAccess(sessionId, email) : false;
  const paidBundleOffer = getPaidBundleOffer(session.templateFamily);
  const sampleAssets = getSampleAssets(assets);
  const bundleAssets = hasPaidAccess ? getBundleAssets(assets) : [];
  const intent = session.normalizedIntent;
  const samplePdf = sampleAssets.find(a => a.format === "PDF");
  const previewPng = sampleAssets.find(a => a.format === "PNG");

  const formatLabel = (family = "") =>
    family.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="stack">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section-block" style={{ paddingTop: "3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>

          {/* Left: Product preview card */}
          <div style={{
            background: "linear-gradient(145deg, #1B2A4A 0%, #243659 60%, #1a3048 100%)",
            borderRadius: "18px",
            padding: "2.5rem 2rem 2rem",
            position: "relative",
            overflow: "hidden",
            minHeight: "420px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 60px rgba(27,42,74,0.35)"
          }}>
            {/* Gold accent top bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#C9A84C" }} />

            {/* Top badge */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <span style={{
                  background: "rgba(201,168,76,0.18)",
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  {formatLabel(session.templateFamily)}
                </span>
                <span style={{
                  background: "#C9A84C",
                  color: "#1B2A4A",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em"
                }}>
                  FREE SAMPLE
                </span>
              </div>

              {/* Title */}
              <h2 style={{ color: "#FFFFFF", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "0.75rem" }}>
                {intent.recommendedTitle}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                {intent.intentSummary || intent.recommendedDescription}
              </p>

              {/* Deliverables chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {(intent.deliverables || []).slice(0, 5).map(item => (
                  <span key={item} style={{
                    padding: "5px 12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.8)",
                    background: "rgba(255,255,255,0.06)"
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {samplePdf ? (
                <a
                  href={`/api/assets/${samplePdf.id}/download`}
                  style={{
                    display: "block",
                    background: "#C9A84C",
                    color: "#1B2A4A",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textAlign: "center",
                    textDecoration: "none"
                  }}
                >
                  ↓ Download Free Sample PDF
                </a>
              ) : (
                <div style={{
                  background: "rgba(201,168,76,0.12)",
                  border: "1px dashed rgba(201,168,76,0.4)",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.85rem",
                  textAlign: "center"
                }}>
                  Sample generating — open workspace to download
                </div>
              )}
              <Link
                href={`/workspace/${sessionId}`}
                style={{
                  display: "block",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textAlign: "center",
                  textDecoration: "none"
                }}
              >
                Open Full Workspace →
              </Link>
            </div>

            {/* TDA watermark */}
            <div style={{
              position: "absolute",
              bottom: "1.25rem",
              right: "1.5rem",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.12em",
              fontWeight: 700,
              textTransform: "uppercase"
            }}>
              The Digital Atlas
            </div>
          </div>

          {/* Right: Intent breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.4rem" }}>
                AI DIRECTION
              </p>
              <h1 style={{ fontSize: "1.9rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "0.75rem" }}>
                {intent.recommendedTitle}
              </h1>
              <p style={{ fontSize: "1rem", color: "#555F6F", lineHeight: 1.6 }}>
                {intent.recommendedDescription}
              </p>
            </div>

            {/* Intent tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[intent.useCaseType, intent.audienceProfile, intent.styleDirection].filter(Boolean).map(tag => (
                <span key={tag} style={{
                  padding: "5px 14px",
                  background: "#F0ECD8",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  color: "#1B2A4A",
                  fontWeight: 500
                }}>{tag}</span>
              ))}
            </div>

            {/* Why it fits */}
            {(intent.whyItFits || []).length > 0 && (
              <div style={{ background: "#F8F6F2", borderRadius: "12px", padding: "1.25rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.8rem", color: "#1B2A4A", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Why this fits
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(intent.whyItFits || []).slice(0, 4).map(item => (
                    <li key={item} style={{ display: "flex", gap: "0.6rem", fontSize: "0.88rem", color: "#444" }}>
                      <span style={{ color: "#C9A84C", flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bundle offer */}
            <div style={{
              border: "2px solid #1B2A4A",
              borderRadius: "12px",
              padding: "1.25rem",
              background: "#FFFFFF"
            }}>
              <p style={{ fontWeight: 700, fontSize: "0.75rem", color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                Full Bundle
              </p>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1B2A4A", marginBottom: "0.25rem" }}>
                {paidBundleOffer.bundleName}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
                {paidBundleOffer.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1B2A4A" }}>
                  {paidBundleOffer.priceLabel}
                </span>
                <Link href={`/workspace/${sessionId}`} style={{
                  background: "#1B2A4A",
                  color: "#FFFFFF",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none"
                }}>
                  Unlock Bundle →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workspace section ────────────────────────────────────────── */}
      <WorkspaceSessionClient
        session={session}
        sampleAssets={sampleAssets}
        bundleAssets={bundleAssets}
        paidBundleOffer={paidBundleOffer}
        hasPaidAccess={hasPaidAccess}
        entryMode="ideas"
      />
    </div>
  );
}
