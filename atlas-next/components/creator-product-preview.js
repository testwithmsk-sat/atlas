"use client";

import { useState } from "react";

const FORMAT_ICONS  = { PDF: "📄", XLSX: "📊", DOCX: "📝", PNG: "🖼️" };
const FORMAT_LABELS = {
  PDF:  "Ready-to-print PDF",
  XLSX: "Editable spreadsheet",
  DOCX: "Editable Word doc",
  PNG:  "High-res preview",
};

// ── Realistic document mockup renderer ───────────────────────────────────────
function DocMockup({ sample, productTitle }) {
  const name = sample?.name ?? "";
  const desc = sample?.desc ?? sample?.description ?? "";
  const items = sample?.items ?? [];

  const isSpreadsheet = /budget|tracker|cost|finance|spend|expense|sheet/i.test(name);
  const isTimeline    = /timeline|schedule|planner|calendar|itinerary|checklist/i.test(name);
  const isContact     = /contact|vendor|supplier|address|directory/i.test(name);

  const headerBar = (label) => (
    <div style={{ background: "#1B2A4A", borderRadius: "4px", padding: "8px 14px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ color: "#C9A84C", fontSize: "11px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
        The Digital Atlas · {label}
      </span>
    </div>
  );

  const baseStyle = {
    background: "#fff", minHeight: "320px", padding: "28px 32px",
    fontFamily: "Georgia, serif", position: "relative", color: "#1B2A4A",
  };

  // ── Spreadsheet / budget ──────────────────────────────────────────
  if (isSpreadsheet) {
    const rows = items.length
      ? items.slice(0, 6).map((item, i) => {
          const parts = String(item).split("|");
          return [parts[0] || item, parts[1] || "—", parts[2] || "Pending"];
        })
      : [
          ["Venue",         "₹40,000", "Booked"],
          ["Catering",      "₹50,000", "Pending"],
          ["Photography",   "₹20,000", "Booked"],
          ["Decorations",   "₹15,000", "Pending"],
          ["Miscellaneous", "₹10,000", "—"],
        ];

    return (
      <div style={baseStyle}>
        {headerBar("Budget Tracker")}
        <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px" }}>{name || productTitle}</div>
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px", fontFamily: "sans-serif" }}>{desc}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
          {[["Total budget","₹1,50,000"],["Spent","₹60,000"],["Remaining","₹90,000"]].map(([l,v]) => (
            <div key={l} style={{ background: "#f8f6f2", borderRadius: "6px", padding: "8px 10px" }}>
              <div style={{ fontSize: "10px", color: "#999", marginBottom: "2px", fontFamily: "sans-serif" }}>{l}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "sans-serif" }}>{v}</div>
            </div>
          ))}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", fontFamily: "sans-serif" }}>
          <thead>
            <tr style={{ background: "#1B2A4A" }}>
              {["Category","Budget","Status"].map(h => (
                <th key={h} style={{ padding: "6px 8px", color: "#C9A84C", textAlign: "left", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([cat, bgt, st], i) => (
              <tr key={i} style={{ background: i%2===0 ? "#fff" : "#f8f6f2", borderBottom: "0.5px solid #ede9e0" }}>
                <td style={{ padding: "5px 8px", fontWeight: 600, color: "#1B2A4A" }}>{cat}</td>
                <td style={{ padding: "5px 8px" }}>{bgt}</td>
                <td style={{ padding: "5px 8px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "999px", fontWeight: 600,
                    background: st==="Booked" ? "#EAF3DE" : "#FAEEDA",
                    color: st==="Booked" ? "#3B6D11" : "#854F0B" }}>
                    {st}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Timeline / schedule ───────────────────────────────────────────
  if (isTimeline) {
    const slots = items.length
      ? items.slice(0, 7).map((item, i) => {
          const parts = String(item).split(":");
          if (parts.length > 1) return [parts[0].trim(), parts.slice(1).join(":").trim()];
          return [`Step ${i + 1}`, item];
        })
      : [
          ["Week 1",  "Confirm venue and set deposit"],
          ["Week 2",  "Book photographer & caterer"],
          ["Week 4",  "Send invitations"],
          ["Week 8",  "Final guest RSVP count"],
          ["Week 10", "Confirm all vendors"],
          ["Day before", "Final venue walkthrough"],
          ["Day of", "Coordinator briefing 8:00 AM"],
        ];

    return (
      <div style={baseStyle}>
        {headerBar("Planner")}
        <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px" }}>{name || productTitle}</div>
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px", fontFamily: "sans-serif" }}>{desc}</div>
        {slots.map(([time, label], i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: "8px", marginBottom: "8px", borderBottom: "0.5px solid #f0ede6", fontFamily: "sans-serif" }}>
            <span style={{ fontSize: "10px", color: "#C9A84C", fontWeight: 700, minWidth: "70px", paddingTop: "1px" }}>{time}</span>
            <div style={{ flex: 1, fontSize: "12px", color: "#1B2A4A" }}>{label}</div>
            <div style={{ width: "10px", height: "10px", border: "1.5px solid #1B2A4A", borderRadius: "2px", flexShrink: 0, marginTop: "2px" }} />
          </div>
        ))}
      </div>
    );
  }

  // ── Contact sheet ─────────────────────────────────────────────────
  if (isContact) {
    const contacts = items.length
      ? items.slice(0, 5).map(item => ({ name: String(item).split("|")[0] || item, status: "Pending", note: "" }))
      : [
          { name: "Venue coordinator", status: "Confirmed", note: "Deposit paid" },
          { name: "Photographer",      status: "Confirmed", note: "Contract signed" },
          { name: "Caterer",           status: "Pending",   note: "3 quotes received" },
          { name: "Florist",           status: "Pending",   note: "Not yet contacted" },
        ];

    return (
      <div style={baseStyle}>
        {headerBar("Vendor Contacts")}
        <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px" }}>{name || productTitle}</div>
        <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px", fontFamily: "sans-serif" }}>{desc}</div>
        {contacts.map((c, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: "0.5px solid #f0ede6", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1B2A4A" }}>{c.name}</span>
              <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "999px", fontWeight: 600,
                background: c.status==="Confirmed" ? "#EAF3DE" : "#FAEEDA",
                color: c.status==="Confirmed" ? "#3B6D11" : "#854F0B" }}>
                {c.status}
              </span>
            </div>
            {c.note && <div style={{ fontSize: "11px", color: "#999" }}>{c.note}</div>}
          </div>
        ))}
      </div>
    );
  }

  // ── Default: checklist ────────────────────────────────────────────
  const checkItems = items.length
    ? items.slice(0, 8).map((item, i) => ({ label: String(item), done: i < 2 }))
    : [
        { label: "Set overall budget",        done: true  },
        { label: "Draft guest list",          done: true  },
        { label: "Book venue",                done: false },
        { label: "Hire photographer",         done: false },
        { label: "Send save-the-dates",       done: false },
        { label: "Confirm catering menu",     done: false },
        { label: "Arrange florals",           done: false },
        { label: "Final RSVP count",          done: false },
      ];

  return (
    <div style={baseStyle}>
      {headerBar("Planning Kit")}
      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "2px" }}>{name || productTitle}</div>
      <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px", fontFamily: "sans-serif" }}>{desc}</div>
      {checkItems.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderBottom: "0.5px solid #f0ede6", fontFamily: "sans-serif", fontSize: "12px" }}>
          <div style={{ width: "14px", height: "14px", border: "1.5px solid #1B2A4A", borderRadius: "3px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: item.done ? "#1B2A4A" : "transparent" }}>
            {item.done && <span style={{ color: "#fff", fontSize: "9px", lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ flex: 1, color: item.done ? "#999" : "#1B2A4A", textDecoration: item.done ? "line-through" : "none" }}>
            {item.label}
          </span>
          <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "999px", fontWeight: 600,
            background: item.done ? "#EAF3DE" : "#FAEEDA",
            color: item.done ? "#3B6D11" : "#854F0B" }}>
            {item.done ? "Done" : "Pending"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function CreatorProductPreview({ session, sampleAssets = [], paidBundleOffer, onUnlock }) {
  const intent = session?.normalizedIntent ?? {};
  const deliverables = intent.deliverables ?? [];
  const formats = paidBundleOffer?.includedFormats ?? ["PDF", "DOCX", "XLSX"];

  // Build samples from real deliverables
  const samples = deliverables.slice(0, 5).map((name, i) => {
    const emojis = ["📄", "📊", "📝", "✅", "🗓️"];
    return { name, desc: `Tailored for: ${intent.useCaseType || "your goal"}`, emoji: emojis[i % emojis.length], items: [] };
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const active = samples[activeIdx] ?? null;

  const fileExtFor = (idx) => {
    const ext = formats[idx % formats.length] ?? "PDF";
    return ext.toLowerCase();
  };

  const samplePdf = sampleAssets.find(a => a.format === "PDF");

  return (
    <div className="info-card creator-card" style={{ marginBottom: "1.5rem" }}>

      {/* Success banner */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "#EAF3DE", border: "0.5px solid #C0DD97", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "16px" }}>✅</span>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#3B6D11" }}>
          Your product is ready — here's a preview of what's inside
        </span>
      </div>

      {/* Title + description */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1B2A4A", marginBottom: "6px" }}>
        {intent.recommendedTitle}
      </h2>
      <p style={{ fontSize: "0.88rem", color: "#666", marginBottom: "14px", lineHeight: 1.5 }}>
        {intent.intentSummary || intent.recommendedDescription}
      </p>

      {/* Format pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {formats.map(f => (
          <span key={f} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "999px", border: "0.5px solid rgba(27,42,74,0.15)", fontSize: "12px", fontWeight: 500, color: "#555", background: "#fff" }}>
            {FORMAT_ICONS[f] ?? "📄"} {FORMAT_LABELS[f] ?? f}
          </span>
        ))}
      </div>

      {/* Document selector thumbnails */}
      {samples.length > 0 && (
        <>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#999", marginBottom: "10px" }}>
            Preview each document
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: "16px" }}>
            {samples.map((s, i) => (
              <div key={i} onClick={() => setActiveIdx(i)} style={{ border: activeIdx === i ? "1.5px solid #C9A84C" : "0.5px solid rgba(27,42,74,0.12)", borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "border-color .15s", background: activeIdx === i ? "#fffef8" : "#fff" }}>
                <div style={{ height: "72px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "#f8f6f2" }}>
                  {s.emoji}
                </div>
                <div style={{ padding: "8px 10px", borderTop: "0.5px solid #f0ede6" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#1B2A4A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                  <div style={{ fontSize: "10px", color: "#999", marginTop: "2px", textTransform: "uppercase" }}>{fileExtFor(i)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Document preview window */}
          <div style={{ border: "0.5px solid rgba(27,42,74,0.12)", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
            {/* Chrome bar */}
            <div style={{ background: "#e8e6e0", padding: "7px 12px", display: "flex", alignItems: "center", gap: "7px", borderBottom: "0.5px solid rgba(27,42,74,0.1)" }}>
              {["#e74c3c","#f39c12","#27ae60"].map(c => (
                <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, background: "#fff", borderRadius: "4px", padding: "3px 10px", fontSize: "11px", color: "#999", border: "0.5px solid rgba(27,42,74,0.1)" }}>
                {active ? `${active.name.toLowerCase().replace(/\s+/g, "-")}.${fileExtFor(activeIdx)}` : "preview"}
              </div>
              <span style={{ fontSize: "10px", color: "#999", fontFamily: "sans-serif" }}>Free sample</span>
            </div>
            {active && <DocMockup sample={active} productTitle={intent.recommendedTitle} />}
          </div>
        </>
      )}

      {/* Live PDF download if available */}
      {samplePdf && (
        <div style={{ marginBottom: "16px" }}>
          <a href={`/api/assets/${samplePdf.id}/download`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#F0ECD8", border: "1px solid #C9A84C", borderRadius: "8px", color: "#1B2A4A", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>
            📄 Download your free starter PDF
          </a>
        </div>
      )}

      {/* Lock note */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "rgba(27,42,74,0.04)", border: "0.5px solid rgba(27,42,74,0.1)", marginBottom: "16px", fontSize: "12px", color: "#666" }}>
        <span>🔒</span>
        <span>This is a <strong>sample preview</strong>. The full bundle includes all formats — fully editable and personalised to your goal.</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onUnlock} style={{ padding: "10px 24px", background: "#C9A84C", color: "#1B2A4A", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
          👑 Unlock full bundle — {paidBundleOffer?.priceLabel}
        </button>
        <span style={{ fontSize: "12px", color: "#999" }}>One-time payment · instant download</span>
      </div>
    </div>
  );
}
