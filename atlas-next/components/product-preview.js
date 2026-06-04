"use client";

import { useState, useEffect } from "react";

// ── Colour tokens ─────────────────────────────────────────────────────────────
const NAVY = "#1B2A4A";
const GOLD = "#C9A84C";
const OFF  = "#F8F6F2";
const ACC  = "#F0ECD8";

// ── Small helpers ─────────────────────────────────────────────────────────────
function Badge({ children, color = GOLD, bg = "rgba(201,168,76,0.12)" }) {
  return (
    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
      fontWeight: 700, color, background: bg, border: `1px solid ${color}40`,
      letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
      {children}
    </span>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{ background: NAVY, borderRadius: "6px", padding: "8px 16px",
      marginBottom: "14px", marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: GOLD, fontSize: "11px", fontWeight: 700,
        letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
        {children}
      </span>
    </div>
  );
}

// ── Document renderers ────────────────────────────────────────────────────────

function ChecklistDoc({ title, items = [], intro = "" }) {
  const [ticked, setTicked] = useState({});
  const toggle = (i) => setTicked(p => ({ ...p, [i]: !p[i] }));

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Georgia, serif", color: NAVY }}>
      <SectionHeader>The Digital Atlas · Planning Kit</SectionHeader>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{title}</h2>
      {intro && <p style={{ fontSize: "12px", color: "#777", marginBottom: "18px", fontFamily: "sans-serif", lineHeight: 1.5 }}>{intro}</p>}

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <div style={{ background: ACC, borderRadius: "8px", padding: "8px 14px", flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "sans-serif" }}>{items.length}</div>
          <div style={{ fontSize: "10px", color: "#999", fontFamily: "sans-serif" }}>Total items</div>
        </div>
        <div style={{ background: "#EAF3DE", borderRadius: "8px", padding: "8px 14px", flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "sans-serif", color: "#3B6D11" }}>
            {Object.values(ticked).filter(Boolean).length}
          </div>
          <div style={{ fontSize: "10px", color: "#3B6D11", fontFamily: "sans-serif" }}>Completed</div>
        </div>
        <div style={{ background: "#FAEEDA", borderRadius: "8px", padding: "8px 14px", flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "sans-serif", color: "#854F0B" }}>
            {items.length - Object.values(ticked).filter(Boolean).length}
          </div>
          <div style={{ fontSize: "10px", color: "#854F0B", fontFamily: "sans-serif" }}>Remaining</div>
        </div>
      </div>

      {items.map((item, i) => {
        const done = ticked[i];
        return (
          <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: "12px",
            padding: "9px 0", borderBottom: "0.5px solid #f0ede6", cursor: "pointer",
            fontFamily: "sans-serif", transition: "opacity 0.15s" }}>
            <div style={{ width: "16px", height: "16px", border: `2px solid ${done ? NAVY : "#ccc"}`,
              borderRadius: "4px", flexShrink: 0, display: "flex", alignItems: "center",
              justifyContent: "center", background: done ? NAVY : "transparent" }}>
              {done && <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: "12.5px", color: done ? "#aaa" : NAVY,
              textDecoration: done ? "line-through" : "none" }}>{item}</span>
            <Badge color={done ? "#3B6D11"  : "#854F0B"}
                   bg={done ? "#EAF3DE" : "#FAEEDA"}>
              {done ? "Done" : "Pending"}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

function SpreadsheetDoc({ title, rows = [], intro = "" }) {
  if (!rows.length) return null;
  const headers = rows[0];
  const dataRows = rows.slice(1);

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Georgia, serif", color: NAVY }}>
      <SectionHeader>The Digital Atlas · Tracker</SectionHeader>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{title}</h2>
      {intro && <p style={{ fontSize: "12px", color: "#777", marginBottom: "18px", fontFamily: "sans-serif", lineHeight: 1.5 }}>{intro}</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", fontFamily: "sans-serif" }}>
          <thead>
            <tr style={{ background: NAVY }}>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: "8px 10px", color: GOLD, textAlign: "left", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {String(h).replace(/^\*\*|\*\*$/g, "")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : OFF, borderBottom: "0.5px solid #ede9e0" }}>
                {headers.map((_, ci) => {
                  const val = String(row[ci] ?? "");
                  const isStatus = /pending|done|complete|booked|confirmed|active|not started/i.test(val);
                  return (
                    <td key={ci} style={{ padding: "7px 10px", color: NAVY, verticalAlign: "top" }}>
                      {isStatus ? (
                        <Badge
                          color={/done|complete|booked|confirmed/i.test(val) ? "#3B6D11" : "#854F0B"}
                          bg={/done|complete|booked|confirmed/i.test(val) ? "#EAF3DE" : "#FAEEDA"}>
                          {val}
                        </Badge>
                      ) : (
                        <span style={{ fontSize: "11.5px" }}>{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimelineDoc({ title, steps = [], intro = "" }) {
  return (
    <div style={{ padding: "28px 32px", fontFamily: "Georgia, serif", color: NAVY }}>
      <SectionHeader>The Digital Atlas · Timeline</SectionHeader>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{title}</h2>
      {intro && <p style={{ fontSize: "12px", color: "#777", marginBottom: "18px", fontFamily: "sans-serif", lineHeight: 1.5 }}>{intro}</p>}
      <div style={{ position: "relative", paddingLeft: "28px" }}>
        <div style={{ position: "absolute", left: "9px", top: 0, bottom: 0, width: "2px", background: "#ede9e0" }} />
        {steps.map((step, i) => (
          <div key={i} style={{ position: "relative", marginBottom: "16px" }}>
            <div style={{ position: "absolute", left: "-23px", top: "2px", width: "12px", height: "12px",
              borderRadius: "50%", background: GOLD, border: `2px solid ${NAVY}`, flexShrink: 0 }} />
            <div style={{ fontFamily: "sans-serif" }}>
              <div style={{ fontSize: "10px", color: GOLD, fontWeight: 700, letterSpacing: ".08em",
                textTransform: "uppercase", marginBottom: "2px" }}>
                {step.phase}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: NAVY, marginBottom: "2px" }}>
                {step.task}
              </div>
              {step.detail && (
                <div style={{ fontSize: "11px", color: "#888", lineHeight: 1.4 }}>{step.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionDoc({ title, sections = [], intro = "" }) {
  const [open, setOpen] = useState({0: true});

  return (
    <div style={{ padding: "28px 32px", fontFamily: "Georgia, serif", color: NAVY }}>
      <SectionHeader>The Digital Atlas · Planning Guide</SectionHeader>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{title}</h2>
      {intro && <p style={{ fontSize: "12px", color: "#777", marginBottom: "18px", fontFamily: "sans-serif", lineHeight: 1.5 }}>{intro}</p>}

      {sections.map((s, i) => (
        <div key={i} style={{ marginBottom: "10px", border: "0.5px solid rgba(27,42,74,0.1)", borderRadius: "10px", overflow: "hidden" }}>
          <div onClick={() => setOpen(p => ({ ...p, [i]: !p[i] }))}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", background: open[i] ? ACC : "#fff",
              cursor: "pointer", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>{s.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: NAVY }}>{s.heading}</span>
            </div>
            <span style={{ color: GOLD, fontSize: "16px", fontWeight: 700 }}>{open[i] ? "−" : "+"}</span>
          </div>
          {open[i] && (
            <div style={{ padding: "14px 16px", background: "#fff", borderTop: `1px solid ${ACC}` }}>
              {s.body && <p style={{ fontSize: "12px", color: "#777", marginBottom: "10px", fontFamily: "sans-serif", lineHeight: 1.5 }}>{s.body}</p>}
              {(s.items || []).map((item, j) => (
                <div key={j} style={{ display: "flex", gap: "10px", padding: "6px 0",
                  borderBottom: "0.5px solid #f5f2ec", fontFamily: "sans-serif", fontSize: "12px" }}>
                  <span style={{ color: GOLD, flexShrink: 0, fontWeight: 700, marginTop: "1px" }}>→</span>
                  <span style={{ color: "#333", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── AI content fetcher ────────────────────────────────────────────────────────
async function fetchPreviewContent(sessionId, assetId, token) {
  try {
    const url = `/api/assets/${assetId}/preview-data${token ? `?t=${token}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── Main ProductPreview component ─────────────────────────────────────────────
export function ProductPreview({ session, sampleAssets = [], paidBundleOffer, onUnlock, sessionToken = "" }) {
  const intent = session?.normalizedIntent ?? {};
  const samplePdf = sampleAssets.find(a => a.format === "PDF" && !a.isPaid);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDoc, setActiveDoc] = useState(0);
  const [fetched, setFetched] = useState(false);

  // Build document tabs from deliverables
  const deliverables = intent.deliverables ?? [];
  const formats = paidBundleOffer?.includedFormats ?? ["PDF", "DOCX", "XLSX"];
  const emojis = ["📋", "📊", "🗓️", "📝", "📞", "✅", "📄", "🗂️"];

  const docs = deliverables.slice(0, 5).map((name, i) => ({
    name,
    emoji: emojis[i % emojis.length],
    format: formats[i % formats.length]
  }));

  // Fetch AI-structured preview data
  useEffect(() => {
    if (fetched || !samplePdf?.id) return;
    setFetched(true);
    setLoading(true);
    fetchPreviewContent(session.sessionId, samplePdf.id, sessionToken)
      .then(data => { if (data) setContent(data); })
      .finally(() => setLoading(false));
  }, [samplePdf?.id]);

  // Render the correct doc type based on content and active selection
  function renderDocPreview() {
    const docName = docs[activeDoc]?.name ?? "";

    if (!content && loading) {
      return (
        <div style={{ minHeight: "360px", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "12px", background: OFF }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid rgba(27,42,74,0.15)",
            borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#888", fontSize: "13px", fontFamily: "sans-serif" }}>
            AI is generating your personalised preview…
          </p>
        </div>
      );
    }

    if (!content) {
      // Fallback: render based on deliverable name guess
      const isSheet   = /budget|tracker|cost|expense|finance/i.test(docName);
      const isTime    = /timeline|schedule|checklist|planner|step/i.test(docName);

      if (isSheet) {
        return <SpreadsheetDoc title={docName} intro={`Personalised for: ${intent.useCaseType || "your goal"}`}
          rows={[
            ["Item", "Budget", "Actual", "Status"],
            ["Category 1", "—", "—", "Pending"],
            ["Category 2", "—", "—", "Pending"],
          ]} />;
      }
      if (isTime) {
        return <ChecklistDoc title={docName} intro={`Generated for: ${intent.recommendedTitle}`}
          items={(intent.deliverables || []).slice(0, 8)} />;
      }
      return <SectionDoc title={docName || intent.recommendedTitle}
        intro={intent.intentSummary || intent.recommendedDescription}
        sections={(intent.deliverables || []).slice(0, 4).map((d, i) => ({
          heading: d, icon: emojis[i], body: "", items: []
        }))} />;
    }

    // Render from real AI content
    const isSheet = /budget|tracker|cost|expense|finance|spread/i.test(docName);
    const isTime  = /timeline|schedule|itinerary/i.test(docName);

    if (isSheet && content.xlsxRows?.length) {
      return <SpreadsheetDoc title={docName} intro={content.intro} rows={content.xlsxRows} />;
    }
    if (isTime && content.timeline?.steps?.length) {
      return <TimelineDoc title={docName} intro={content.intro} steps={content.timeline.steps} />;
    }
    if (content.sections?.length && activeDoc === 0) {
      return <SectionDoc title={content.title || intent.recommendedTitle} intro={content.intro} sections={content.sections} />;
    }
    // Checklist for any other doc
    const allItems = [
      ...(content.sections?.[activeDoc]?.items || []),
      ...(content.sections?.[0]?.items || [])
    ].slice(0, 10);
    return <ChecklistDoc title={docName} intro={content.intro} items={allItems.length ? allItems : intent.deliverables?.slice(0,8) || []} />;
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>

      {/* ── Success banner ──────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
        borderRadius: "10px", background: "#EAF3DE", border: "1px solid #C0DD97", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "18px" }}>✅</span>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3B6D11", fontFamily: "sans-serif" }}>
            Your product is ready — here's a live preview
          </div>
          <div style={{ fontSize: "11px", color: "#5a9b2a", fontFamily: "sans-serif" }}>
            AI-generated specifically for: {intent.useCaseType || "your goal"}
          </div>
        </div>
      </div>

      {/* ── Title + intent tags ─────────────────────────────────────── */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: NAVY, marginBottom: "6px", lineHeight: 1.2 }}>
        {intent.recommendedTitle}
      </h2>
      <p style={{ fontSize: "0.88rem", color: "#666", marginBottom: "14px", lineHeight: 1.55, fontFamily: "sans-serif" }}>
        {intent.intentSummary || intent.recommendedDescription}
      </p>

      {/* Intent chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {[intent.useCaseType, intent.audienceProfile, intent.styleDirection].filter(Boolean).map(tag => (
          <span key={tag} style={{ padding: "4px 12px", background: ACC, borderRadius: "999px",
            fontSize: "11px", color: NAVY, fontWeight: 500, fontFamily: "sans-serif" }}>{tag}</span>
        ))}
        {formats.map(f => (
          <span key={f} style={{ padding: "4px 12px", background: "#fff", borderRadius: "999px",
            border: "1px solid rgba(27,42,74,0.12)", fontSize: "11px", color: "#555", fontFamily: "sans-serif" }}>
            {f === "PDF" ? "📄" : f === "XLSX" ? "📊" : "📝"} {f}
          </span>
        ))}
      </div>

      {/* ── Document tabs ────────────────────────────────────────────── */}
      {docs.length > 1 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {docs.map((doc, i) => (
            <button key={i} onClick={() => setActiveDoc(i)} style={{
              padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, transition: "all 0.15s",
              background: activeDoc === i ? NAVY : "#fff",
              color: activeDoc === i ? "#fff" : "#555",
              boxShadow: activeDoc === i ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
            }}>
              {doc.emoji} {doc.name.length > 22 ? doc.name.slice(0, 22) + "…" : doc.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Browser chrome + document window ────────────────────────── */}
      <div style={{ border: "1px solid rgba(27,42,74,0.1)", borderRadius: "14px",
        overflow: "hidden", boxShadow: "0 4px 24px rgba(27,42,74,0.08)", marginBottom: "16px" }}>

        {/* Chrome bar */}
        <div style={{ background: "#E8E6E0", padding: "8px 14px", display: "flex",
          alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(27,42,74,0.08)" }}>
          {["#e74c3c","#f39c12","#27ae60"].map(c => (
            <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, background: "#fff", borderRadius: "5px", padding: "4px 12px",
            fontSize: "11px", color: "#999", border: "0.5px solid rgba(27,42,74,0.1)", fontFamily: "sans-serif" }}>
            {docs[activeDoc]?.name?.toLowerCase().replace(/\s+/g, "-")}.{docs[activeDoc]?.format?.toLowerCase() ?? "pdf"} · Sample preview
          </div>
          <Badge>Free Sample</Badge>
        </div>

        {/* Document content */}
        <div style={{ background: "#fff", maxHeight: "480px", overflowY: "auto" }}>
          {renderDocPreview()}
        </div>
      </div>

      {/* ── Lock note ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 14px",
        borderRadius: "10px", background: "rgba(27,42,74,0.04)", border: "0.5px solid rgba(27,42,74,0.1)",
        marginBottom: "16px", fontSize: "12px", color: "#666", fontFamily: "sans-serif" }}>
        <span style={{ marginTop: "1px" }}>🔒</span>
        <span>
          This is a <strong>live sample preview</strong>. The full bundle includes all formats (PDF, DOCX, XLSX) — fully editable, print-ready, and personalised to your exact goal.
        </span>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onUnlock} style={{ padding: "11px 26px", background: GOLD, color: NAVY,
          border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "14px",
          cursor: "pointer", fontFamily: "sans-serif" }}>
          👑 Unlock full bundle — {paidBundleOffer?.priceLabel}
        </button>
        {samplePdf && (
          <a href={`/api/assets/${samplePdf.id}/download`} style={{ padding: "11px 20px",
            background: "transparent", color: NAVY, border: `1px solid rgba(27,42,74,0.2)`,
            borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
            textDecoration: "none", fontFamily: "sans-serif" }}>
            ↓ Download free PDF
          </a>
        )}
        <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "sans-serif" }}>
          One-time · instant download
        </span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
