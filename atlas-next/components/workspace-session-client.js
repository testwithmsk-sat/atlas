"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState, useEffect } from "react";
import { GeneratedBundleAddToCartButton } from "@/components/generated-bundle-add-to-cart";

// ── In-browser PDF preview component ─────────────────────────────────────────
function PdfPreviewPanel({ assetId, title, isPaid, locked }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const url = `/api/assets/${assetId}/download?disposition=inline`;

  if (locked) {
    return (
      <div style={{
        background: "linear-gradient(145deg,#1B2A4A 0%,#243659 100%)",
        borderRadius: "16px",
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "#C9A84C" }} />
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>Full Bundle Locked</h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", maxWidth: "320px" }}>
          Unlock the full editable bundle to view and download all files — PDF, DOCX, and XLSX.
        </p>
        <div style={{
          background: "rgba(201,168,76,0.15)",
          border: "1px solid rgba(201,168,76,0.35)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          color: "#C9A84C",
          fontSize: "0.85rem",
          fontWeight: 600
        }}>
          {title}
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(23,33,47,0.1)", background: "#f8f6f2", position: "relative" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "1rem",
          background: "#f8f6f2", zIndex: 2, minHeight: "520px"
        }}>
          <div style={{
            width: "40px", height: "40px",
            border: "3px solid rgba(27,42,74,0.15)",
            borderTopColor: "#C9A84C",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ color: "#666", fontSize: "0.9rem" }}>Generating your document…</p>
        </div>
      )}
      {error ? (
        <div style={{ minHeight: "520px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>📄</div>
          <p style={{ color: "#555", fontSize: "0.9rem" }}>Preview not available. Download the file to view it.</p>
          <a href={url} style={{ background: "#1B2A4A", color: "#fff", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            Download to View
          </a>
        </div>
      ) : (
        <iframe
          src={url}
          style={{ width: "100%", height: "620px", border: "none", display: loading ? "none" : "block" }}
          title={`Preview: ${title}`}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />
      )}
    </div>
  );
}

// ── Asset download card ───────────────────────────────────────────────────────
function AssetCard({ asset, sessionId, locked, onUnlock }) {
  const fmt = asset.format;
  const icons = { PDF: "📄", DOCX: "📝", XLSX: "📊", PNG: "🖼️" };
  const colors = { PDF: "#e74c3c", DOCX: "#2980b9", XLSX: "#27ae60", PNG: "#8e44ad" };

  return (
    <div style={{
      border: "1px solid rgba(23,33,47,0.1)",
      borderRadius: "14px",
      padding: "1.25rem",
      background: locked ? "rgba(27,42,74,0.03)" : "#fff",
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      opacity: locked ? 0.7 : 1
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: locked ? "#eee" : `${colors[fmt]}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.4rem", flexShrink: 0
      }}>
        {locked ? "🔒" : icons[fmt]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px" }}>
          {asset.fileName.split("/").pop()}
        </p>
        <p style={{ fontSize: "0.78rem", color: "#888" }}>
          {locked ? "Unlock bundle to access" : `${fmt} — ready to download`}
        </p>
      </div>
      {locked ? (
        <button onClick={onUnlock} style={{
          background: "#C9A84C", color: "#1B2A4A", border: "none",
          padding: "8px 16px", borderRadius: "8px", fontWeight: 700,
          fontSize: "0.8rem", cursor: "pointer", whiteSpace: "nowrap"
        }}>
          Unlock →
        </button>
      ) : (
        <a href={`/api/assets/${asset.id}/download`} style={{
          background: "#1B2A4A", color: "#fff", padding: "8px 16px",
          borderRadius: "8px", fontWeight: 700, fontSize: "0.8rem",
          textDecoration: "none", whiteSpace: "nowrap"
        }}>
          ↓ Download
        </a>
      )}
    </div>
  );
}

// ── Main workspace client ─────────────────────────────────────────────────────
export function WorkspaceSessionClient({
  session,
  sampleAssets = [],
  bundleAssets = [],
  paidBundleOffer,
  hasPaidAccess = false,
  entryMode = "workspace"
}) {
  const router = useRouter();
  const [loadingOptionId, setLoadingOptionId] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [showBundlePanel, setShowBundlePanel] = useState(false);

  const previewAsset = sampleAssets.find((a) => a.format === "PNG");
  const samplePdfAsset = sampleAssets.find((a) => a.format === "PDF");
  const intent = session.normalizedIntent;
  const isIdeasEntry = entryMode === "ideas";

  // All assets for display
  const allBundleFormats = paidBundleOffer?.includedFormats || ["PDF", "DOCX", "XLSX"];

  const chooseOption = (optionId) => {
    setError("");
    setLoadingOptionId(optionId);
    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/generate/${session.sessionId}/sample`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ optionId })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload?.error || "Could not generate sample.");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not generate sample.");
        } finally {
          setLoadingOptionId("");
        }
      })();
    });
  };

  const tabStyle = (tab) => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    background: activeTab === tab ? "#1B2A4A" : "transparent",
    color: activeTab === tab ? "#fff" : "#666",
    transition: "all 0.15s"
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: "2rem", marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.4rem" }}>
          {isIdeasEntry ? "AI-generated direction" : "Your workspace"}
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1B2A4A", marginBottom: "0.5rem", lineHeight: 1.2 }}>
          {intent.recommendedTitle}
        </h1>
        <p style={{ color: "#666", fontSize: "1rem", maxWidth: "680px" }}>
          {intent.intentSummary || intent.recommendedDescription}
        </p>

        {/* Intent tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
          {[intent.useCaseType, intent.audienceProfile, intent.styleDirection].filter(Boolean).map(tag => (
            <span key={tag} style={{
              padding: "4px 12px", background: "#F0ECD8", borderRadius: "999px",
              fontSize: "0.78rem", color: "#1B2A4A", fontWeight: 500
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── Direction selection ───────────────────────────────────────── */}
      {session.sampleStatus === "needs_selection" && (
        <div style={{ background: "#F8F6F2", borderRadius: "16px", padding: "2rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.5rem" }}>
            Choose your direction
          </p>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Which fits you best?
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Pick the option that best matches what you need and we'll generate your files immediately.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            {(session.suggestedOptions || []).map((option) => (
              <div key={option.id} style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", border: "1px solid rgba(23,33,47,0.1)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.4rem" }}>
                  {option.templateFamily?.replace(/_/g, " ")}
                </p>
                <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", fontSize: "1rem" }}>{option.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>{option.description}</p>
                <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "1rem" }}>
                  Formats: {(option.outputFormats || []).join(" + ")}
                </p>
                <button
                  onClick={() => chooseOption(option.id)}
                  disabled={Boolean(loadingOptionId)}
                  style={{
                    width: "100%", padding: "10px", background: "#1B2A4A", color: "#fff",
                    border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer",
                    fontSize: "0.85rem", opacity: loadingOptionId ? 0.6 : 1
                  }}
                >
                  {loadingOptionId === option.id ? "Generating…" : "Generate This →"}
                </button>
              </div>
            ))}
          </div>
          {error && <p style={{ color: "#c0392b", marginTop: "1rem", fontSize: "0.85rem" }}>{error}</p>}
        </div>
      )}

      {/* ── Main two-column layout ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem", alignItems: "start" }}>

        {/* Left: Document viewer */}
        <div>
          {/* Tab bar */}
          <div style={{
            display: "flex", gap: "4px", background: "#F0ECD8",
            borderRadius: "10px", padding: "4px", marginBottom: "1.25rem",
            width: "fit-content"
          }}>
            <button style={tabStyle("preview")} onClick={() => setActiveTab("preview")}>
              📄 Free Sample Preview
            </button>
            {hasPaidAccess && (
              <button style={tabStyle("bundle")} onClick={() => setActiveTab("bundle")}>
                🔓 Full Bundle Files
              </button>
            )}
            {!hasPaidAccess && (
              <button style={{ ...tabStyle("bundle"), opacity: 0.5 }} onClick={() => setShowBundlePanel(true)}>
                🔒 Full Bundle
              </button>
            )}
          </div>

          {/* Free sample PDF viewer */}
          {activeTab === "preview" && (
            <div>
              {samplePdfAsset ? (
                <>
                  <PdfPreviewPanel
                    assetId={samplePdfAsset.id}
                    title={intent.recommendedTitle}
                    isPaid={false}
                    locked={false}
                  />
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                    <a
                      href={`/api/assets/${samplePdfAsset.id}/download`}
                      style={{
                        background: "#1B2A4A", color: "#fff", padding: "10px 20px",
                        borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem",
                        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem"
                      }}
                    >
                      ↓ Download Free Sample PDF
                    </a>
                    {!hasPaidAccess && (
                      <button
                        onClick={() => setShowBundlePanel(true)}
                        style={{
                          background: "#C9A84C", color: "#1B2A4A", padding: "10px 20px",
                          borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem",
                          border: "none", cursor: "pointer"
                        }}
                      >
                        Unlock Full Bundle →
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div style={{
                  background: "#F8F6F2", borderRadius: "16px", minHeight: "400px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: "1rem", padding: "3rem", textAlign: "center"
                }}>
                  <div style={{ fontSize: "2.5rem" }}>⚡</div>
                  <h3 style={{ fontWeight: 700 }}>Your sample is being generated</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", maxWidth: "360px" }}>
                    The AI is building your personalised starter PDF. This usually takes 20-40 seconds. Refresh this page in a moment.
                  </p>
                  <button
                    onClick={() => router.refresh()}
                    style={{
                      background: "#1B2A4A", color: "#fff", padding: "10px 20px",
                      borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem",
                      border: "none", cursor: "pointer"
                    }}
                  >
                    Check again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bundle files viewer */}
          {activeTab === "bundle" && hasPaidAccess && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
                Your full bundle is ready. Preview or download each file below.
              </p>
              {bundleAssets.map(asset => (
                <div key={asset.id}>
                  <AssetCard asset={asset} sessionId={session.sessionId} locked={false} />
                  {asset.format === "PDF" && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <PdfPreviewPanel assetId={asset.id} title={intent.recommendedTitle} isPaid locked={false} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Locked bundle placeholder */}
          {activeTab === "bundle" && !hasPaidAccess && (
            <PdfPreviewPanel assetId={null} title={intent.recommendedTitle} isPaid locked />
          )}
        </div>

        {/* Right: sidebar ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "1.5rem" }}>

          {/* What's included card */}
          <div style={{ background: "#F8F6F2", borderRadius: "16px", padding: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem" }}>
              What's included
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {(intent.deliverables || []).map(item => (
                <div key={item} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.85rem" }}>
                  <span style={{ color: "#C9A84C", flexShrink: 0, marginTop: "1px" }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bundle offer card */}
          {!hasPaidAccess ? (
            <div style={{
              background: "linear-gradient(145deg,#1B2A4A 0%,#243659 100%)",
              borderRadius: "16px", padding: "1.5rem",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "#C9A84C" }} />
              <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.5rem" }}>
                Full Bundle
              </p>
              <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem", marginBottom: "0.4rem" }}>
                {paidBundleOffer?.bundleName}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                {paidBundleOffer?.description}
              </p>

              {/* Format pills */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {allBundleFormats.map(fmt => (
                  <span key={fmt} style={{
                    padding: "3px 10px", border: "1px solid rgba(201,168,76,0.4)",
                    borderRadius: "999px", fontSize: "0.72rem", color: "#C9A84C", fontWeight: 600
                  }}>{fmt}</span>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>
                  {paidBundleOffer?.priceLabel}
                </span>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>
                  $29
                </span>
              </div>

              <GeneratedBundleAddToCartButton
                sessionId={session.sessionId}
                bundleName={paidBundleOffer?.bundleName}
                priceLabel={paidBundleOffer?.priceLabel}
                includedFormats={paidBundleOffer?.includedFormats}
                deliverables={intent.deliverables}
                image={previewAsset ? `/api/assets/${previewAsset.id}/download?disposition=inline` : ""}
              />
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginTop: "0.75rem", textAlign: "center" }}>
                One-time payment · Instant download
              </p>
            </div>
          ) : (
            <div style={{ background: "#edfaf1", border: "1px solid #a8e0b8", borderRadius: "16px", padding: "1.25rem" }}>
              <p style={{ fontWeight: 700, color: "#1a5c33", marginBottom: "0.25rem" }}>✓ Bundle Unlocked</p>
              <p style={{ fontSize: "0.85rem", color: "#2d7a47" }}>
                All files are ready. Click "Full Bundle Files" above to view and download.
              </p>
            </div>
          )}

          {/* Why it fits */}
          {(intent.whyItFits || []).length > 0 && (
            <div style={{ border: "1px solid rgba(23,33,47,0.08)", borderRadius: "16px", padding: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
                Why this direction fits
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(intent.whyItFits || []).slice(0, 4).map(item => (
                  <div key={item} style={{ display: "flex", gap: "0.5rem", fontSize: "0.83rem", color: "#555" }}>
                    <span style={{ color: "#7aa186", flexShrink: 0 }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start again */}
          <Link href="/" style={{
            display: "block", textAlign: "center", padding: "10px",
            border: "1px solid rgba(23,33,47,0.15)", borderRadius: "10px",
            color: "#666", fontSize: "0.82rem", textDecoration: "none",
            fontWeight: 500
          }}>
            ← Generate a new product
          </Link>
        </div>
      </div>

      {/* ── Bundle unlock modal ───────────────────────────────────────── */}
      {showBundlePanel && !hasPaidAccess && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem"
        }} onClick={() => setShowBundlePanel(false)}>
          <div style={{
            background: "#fff", borderRadius: "20px", padding: "2.5rem",
            maxWidth: "480px", width: "100%", position: "relative"
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowBundlePanel(false)} style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "none", border: "none", fontSize: "1.5rem",
              cursor: "pointer", color: "#888", lineHeight: 1
            }}>×</button>

            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.5rem" }}>
              Unlock Full Bundle
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              {paidBundleOffer?.bundleName}
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Get the complete editable package tailored to your goal — not a generic template.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
              {allBundleFormats.map(fmt => {
                const labels = { PDF: "📄 Branded PDF — print-ready planning guide", DOCX: "📝 Word DOCX — fully editable template", XLSX: "📊 Excel XLSX — pre-filled tracker/planner" };
                return (
                  <div key={fmt} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.88rem" }}>
                    <span style={{ color: "#7aa186", fontWeight: 700 }}>✓</span>
                    {labels[fmt] || fmt}
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.88rem" }}>
                <span style={{ color: "#7aa186", fontWeight: 700 }}>✓</span>
                Built specifically for: {intent.recommendedTitle}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1B2A4A" }}>
                {paidBundleOffer?.priceLabel}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#aaa" }}>one-time · instant download</span>
            </div>

            <GeneratedBundleAddToCartButton
              sessionId={session.sessionId}
              bundleName={paidBundleOffer?.bundleName}
              priceLabel={paidBundleOffer?.priceLabel}
              includedFormats={paidBundleOffer?.includedFormats}
              deliverables={intent.deliverables}
              image={previewAsset ? `/api/assets/${previewAsset.id}/download?disposition=inline` : ""}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
