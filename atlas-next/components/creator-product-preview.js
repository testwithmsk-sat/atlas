"use client";

import { useState } from "react";

const FORMAT_STYLE = {
  PDF:       { bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.3)",  color:"#fca5a5", badge:"rgba(239,68,68,0.15)"  },
  XLSX:      { bg:"rgba(34,197,94,0.1)",  border:"rgba(34,197,94,0.3)",  color:"#86efac", badge:"rgba(34,197,94,0.15)"  },
  DOCX:      { bg:"rgba(59,130,246,0.1)", border:"rgba(59,130,246,0.3)", color:"#93c5fd", badge:"rgba(59,130,246,0.15)" },
  PNG:       { bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.3)", color:"#fde68a", badge:"rgba(251,191,36,0.15)" },
  Checklist: { bg:"rgba(168,85,247,0.1)", border:"rgba(168,85,247,0.3)", color:"#c084fc", badge:"rgba(168,85,247,0.15)" },
  BONUS:     { bg:"rgba(168,85,247,0.1)", border:"rgba(168,85,247,0.3)", color:"#c084fc", badge:"rgba(168,85,247,0.15)" },
};
const FORMAT_ICONS = { PDF:"📄", XLSX:"📊", DOCX:"📝", PNG:"🖼️", Checklist:"✅", BONUS:"🎁" };

// ── Thumbnail renderers (visual only) ────────────────────────────────────────
function PdfThumb() {
  return (
    <div style={{width:"78%",height:"85%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px",padding:"8px",display:"flex",flexDirection:"column",gap:"4px"}}>
      <div style={{height:"8px",background:"rgba(239,68,68,0.5)",borderRadius:"2px"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",width:"60%"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",width:"75%"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.08)",borderRadius:"2px",width:"55%"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.08)",borderRadius:"2px"}}/>
    </div>
  );
}

function XlsxThumb({ rows = [] }) {
  const display = rows.slice(0, 4);
  const header = ["Item","Budget","Status"];
  return (
    <div style={{width:"88%",height:"85%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px",padding:"6px",display:"flex",flexDirection:"column",gap:"3px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 0.8fr",gap:"2px"}}>
        {header.map((h,i)=>(
          <div key={i} style={{height:"14px",borderRadius:"1px",display:"flex",alignItems:"center",padding:"0 3px",fontSize:"7px",background:"rgba(34,197,94,0.35)",color:"#86efac",fontWeight:600}}>{h}</div>
        ))}
      </div>
      {display.map((row,ri)=>(
        <div key={ri} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 0.8fr",gap:"2px"}}>
          <div style={{height:"14px",borderRadius:"1px",display:"flex",alignItems:"center",padding:"0 3px",fontSize:"7px",background:"rgba(34,197,94,0.08)",color:"#6b7280"}}>{String(row.category||"").slice(0,14)}</div>
          <div style={{height:"14px",borderRadius:"1px",display:"flex",alignItems:"center",padding:"0 3px",fontSize:"7px",background:"rgba(34,197,94,0.08)",color:"#6b7280"}}>{String(row.estimated||"").slice(0,10)}</div>
          <div style={{height:"14px",borderRadius:"1px",display:"flex",alignItems:"center",padding:"0 3px",fontSize:"7px",background:"rgba(34,197,94,0.08)",color:"#86efac"}}>{String(row.status||"").slice(0,8)}</div>
        </div>
      ))}
    </div>
  );
}

function DocxThumb() {
  return (
    <div style={{width:"78%",height:"85%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px",padding:"8px",display:"flex",flexDirection:"column",gap:"4px"}}>
      <div style={{height:"8px",background:"rgba(59,130,246,0.5)",borderRadius:"2px"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",width:"55%"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",width:"85%"}}/>
      <div style={{height:"8px",background:"rgba(59,130,246,0.2)",borderRadius:"2px",width:"50%",marginTop:"4px"}}/>
      <div style={{height:"6px",background:"rgba(255,255,255,0.12)",borderRadius:"2px",width:"90%"}}/>
    </div>
  );
}

function BonusThumb() {
  return (
    <div style={{textAlign:"center",padding:"16px"}}>
      <div style={{fontSize:"26px",marginBottom:"6px"}}>🎁</div>
      <div style={{fontSize:"11px",color:"#a78bca",fontWeight:500}}>Bonus Included</div>
    </div>
  );
}

const THUMB_BG  = {PDF:"#1c0a0a", XLSX:"#0a1c0f", DOCX:"#0a0f1c"};

// ── Expanded preview body (real AI data) ─────────────────────────────────────
function PreviewBody({ fmt, preview }) {
  if (fmt === "XLSX" && preview?.budget?.length) {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:"2px",marginBottom:"2px"}}>
          {["Category","Estimated","Status"].map(h=>(
            <div key={h} style={{height:"20px",borderRadius:"2px",display:"flex",alignItems:"center",padding:"0 6px",fontSize:"10px",background:"rgba(34,197,94,0.2)",color:"#86efac",fontWeight:600}}>{h}</div>
          ))}
        </div>
        {preview.budget.slice(0,6).map((row,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:"2px"}}>
            <div style={{height:"18px",borderRadius:"2px",display:"flex",alignItems:"center",padding:"0 6px",fontSize:"9.5px",background:"rgba(255,255,255,0.05)",color:"#d1fae5",fontWeight:500}}>{row.category}</div>
            <div style={{height:"18px",borderRadius:"2px",display:"flex",alignItems:"center",padding:"0 6px",fontSize:"9.5px",background:"rgba(255,255,255,0.05)",color:"#6b7280"}}>{row.estimated}</div>
            <div style={{height:"18px",borderRadius:"2px",display:"flex",alignItems:"center",padding:"0 6px",fontSize:"9px",background:"rgba(255,255,255,0.03)",color:row.status==="Confirmed"?"#86efac":"#fbbf24",fontWeight:500}}>{row.status}</div>
          </div>
        ))}
      </div>
    );
  }

  if (fmt === "DOCX" && preview?.checklist?.length) {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
        {preview.checklist.slice(0,6).map((item,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <div style={{width:"12px",height:"12px",border:"1px solid rgba(59,130,246,0.5)",borderRadius:"2px",flexShrink:0}}/>
            <div style={{fontSize:"11px",color:"#c7d2fe",lineHeight:1.4}}>{item}</div>
          </div>
        ))}
      </div>
    );
  }

  if (preview?.timeline?.length) {
    return (
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {preview.timeline.slice(0,5).map((step,i)=>(
          <div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
            <div style={{fontSize:"9px",color:"#C9A84C",fontWeight:700,minWidth:"70px",paddingTop:"1px",textTransform:"uppercase",letterSpacing:".04em"}}>{step.phase}</div>
            <div>
              <div style={{fontSize:"11px",color:"#e2d9f3",fontWeight:500}}>{step.task}</div>
              {step.detail && <div style={{fontSize:"10px",color:"#6b7280",marginTop:"2px"}}>{step.detail}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback PDF lines
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
      <div style={{height:"11px",background:"rgba(168,85,247,0.3)",borderRadius:"3px",width:"70%"}}/>
      <div style={{height:"7px",background:"rgba(255,255,255,0.1)",borderRadius:"3px",width:"80%"}}/>
      <div style={{height:"7px",background:"rgba(255,255,255,0.1)",borderRadius:"3px"}}/>
      <div style={{height:"7px",background:"rgba(255,255,255,0.1)",borderRadius:"3px",width:"55%"}}/>
      <div style={{height:"9px",background:"rgba(168,85,247,0.2)",borderRadius:"3px",width:"40%",marginTop:"6px"}}/>
      <div style={{height:"7px",background:"rgba(255,255,255,0.1)",borderRadius:"3px",width:"80%"}}/>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function CreatorProductPreview({ output, userId, onUnlock, onRefine }) {
  const [activeTab, setActiveTab]     = useState("preview");
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [saved, setSaved]             = useState(false);

  const samples  = output?.samples  ?? [];
  const formats  = output?.formats  ?? [];
  const preview  = output?.preview  ?? {};

  const cards = samples.map((s, i) => ({ ...s, fmt: formats[i % Math.max(formats.length, 1)] ?? "PDF" }));
  if (cards.length < 4) cards.push({ emoji:"🎁", name:"Bonus Materials", desc:"Day-of extras & quick-reference cards", fmt:"BONUS" });
  const displayCards = cards.slice(0, 4);
  const sel = displayCards[selectedDoc];

  function ThumbFor({ doc }) {
    if (doc.fmt === "XLSX") return <XlsxThumb rows={preview.budget ?? []} />;
    if (doc.fmt === "DOCX") return <DocxThumb />;
    if (doc.fmt === "PDF")  return <PdfThumb />;
    return <BonusThumb />;
  }

  function tabStyle(t) {
    return {
      padding:"10px 14px", fontSize:"13px", background:"none", border:"none",
      borderBottom: activeTab === t ? "2px solid #c084fc" : "2px solid transparent",
      color: activeTab === t ? "#c084fc" : "#6b7280",
      cursor:"pointer", transition:"all .2s",
      fontFamily:"system-ui,sans-serif", whiteSpace:"nowrap"
    };
  }

  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:"#0d0a1a",borderRadius:"14px",overflow:"hidden",color:"#fff",marginBottom:"1.5rem"}}>

      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#1a0d3a 0%,#0d0a1a 60%)",padding:"1.75rem 1.75rem 0"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"6px",background:"rgba(168,85,247,0.15)",border:"1px solid rgba(168,85,247,0.3)",color:"#c084fc",fontSize:"12px",padding:"4px 12px",borderRadius:"20px",marginBottom:"1rem"}}>
          ✦ AI-generated for you
        </div>
        <div style={{fontSize:"20px",fontWeight:700,color:"#fff",marginBottom:"6px",lineHeight:1.3}}>{output?.title}</div>
        <div style={{fontSize:"14px",color:"#a78bca",marginBottom:"1.25rem",lineHeight:1.5}}>{output?.description}</div>

        <div style={{display:"flex",gap:"8px",marginBottom:"1.25rem",flexWrap:"wrap"}}>
          {formats.map(f => {
            const fs = FORMAT_STYLE[f] ?? FORMAT_STYLE.PDF;
            return (
              <span key={f} style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 12px",borderRadius:"20px",fontSize:"12px",fontWeight:500,background:fs.bg,border:`1px solid ${fs.border}`,color:fs.color}}>
                {FORMAT_ICONS[f] ?? "📄"} {f}
              </span>
            );
          })}
        </div>

        <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,0.08)",margin:"0 -1.75rem",padding:"0 1.75rem"}}>
          <button style={tabStyle("preview")}  onClick={() => setActiveTab("preview")}>Preview</button>
          <button style={tabStyle("contents")} onClick={() => setActiveTab("contents")}>What&apos;s inside</button>
          <button style={tabStyle("reviews")}  onClick={() => setActiveTab("reviews")}>Reviews</button>
        </div>
      </div>

      {/* Body */}
      <div style={{padding:"1.25rem 1.75rem"}}>

        {/* ── PREVIEW TAB ── real AI content ── */}
        {activeTab === "preview" && (
          <>
            {/* Thumbnail grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"1rem"}}>
              {displayCards.map((doc, i) => {
                const fs  = FORMAT_STYLE[doc.fmt] ?? FORMAT_STYLE.PDF;
                const bg  = THUMB_BG[doc.fmt] ?? "#0f0f1a";
                return (
                  <div key={i} onClick={() => setSelectedDoc(i)} style={{
                    background: selectedDoc===i ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.04)",
                    border: selectedDoc===i ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius:"10px", overflow:"hidden", cursor:"pointer", transition:"border-color .2s"
                  }}>
                    <div style={{height:"110px",display:"flex",alignItems:"center",justifyContent:"center",background:bg}}>
                      <ThumbFor doc={doc} />
                    </div>
                    <div style={{padding:"8px 10px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      <div style={{fontSize:"12px",fontWeight:500,color:"#e2d9f3"}}>{doc.name}</div>
                      <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{doc.desc}</div>
                      <span style={{display:"inline-block",fontSize:"10px",padding:"2px 8px",borderRadius:"10px",marginTop:"6px",fontWeight:500,background:fs.badge,color:fs.color}}>{doc.fmt}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expanded doc preview — real AI data */}
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",padding:"1rem",minHeight:"160px",marginBottom:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
                <div style={{width:"32px",height:"32px",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",background:FORMAT_STYLE[sel?.fmt]?.badge ?? "rgba(168,85,247,0.15)"}}>
                  {sel?.emoji ?? FORMAT_ICONS[sel?.fmt] ?? "📄"}
                </div>
                <div>
                  <div style={{fontSize:"14px",fontWeight:500,color:"#e2d9f3"}}>{sel?.name}</div>
                  <div style={{fontSize:"11px",color:"#6b7280"}}>
                    {sel?.fmt==="XLSX" ? "Live tracker — AI-generated rows" :
                     sel?.fmt==="DOCX" ? "Editable document — AI-generated checklist" :
                     sel?.fmt==="BONUS"? "Bonus — included free" :
                     "Planning guide — AI-generated content"}
                  </div>
                </div>
                <div style={{marginLeft:"auto",fontSize:"10px",padding:"3px 10px",borderRadius:"999px",background:"rgba(34,197,94,0.15)",color:"#86efac",fontWeight:600}}>
                  ✦ AI Generated
                </div>
              </div>
              <PreviewBody fmt={sel?.fmt ?? "PDF"} preview={preview} />
            </div>
          </>
        )}

        {/* ── CONTENTS TAB ── */}
        {activeTab === "contents" && (
          <div>
            {samples.map((s, i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"10px",padding:"8px 10px",background:"rgba(255,255,255,0.03)",borderRadius:"8px",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"6px"}}>
                <div style={{width:"20px",height:"20px",borderRadius:"50%",background:"rgba(168,85,247,0.2)",color:"#c084fc",fontSize:"10px",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"1px"}}>{i+1}</div>
                <div>
                  <div style={{fontSize:"13px",color:"#d1c4e9",fontWeight:500}}>{s.emoji} {s.name}</div>
                  <div style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{s.desc}</div>
                </div>
              </div>
            ))}

            {/* Show real checklist items */}
            {preview?.checklist?.length > 0 && (
              <div style={{marginTop:"12px",padding:"12px",background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:"8px"}}>
                <div style={{fontSize:"11px",color:"#c084fc",fontWeight:700,marginBottom:"8px",textTransform:"uppercase",letterSpacing:".08em"}}>Sample checklist items</div>
                {preview.checklist.slice(0,5).map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:"8px",alignItems:"flex-start",marginBottom:"6px",fontSize:"12px",color:"#a78bca"}}>
                    <span style={{color:"#7c3aed",marginTop:"1px"}}>→</span>{item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === "reviews" && (
          <div>
            {[
              {name:"Priya M.", stars:5, text:"The XLSX tracker was a lifesaver — I could see exactly where every rupee was going.", date:"March 2026 · Verified"},
              {name:"Anjali & Rohit", stars:5, text:"Used the planning kit for our 80-guest wedding. The checklist kept us completely on track.", date:"January 2026 · Verified"},
              {name:"Kavitha S.", stars:4, text:"Very comprehensive kit. The PDF planning guide had everything we needed from day one.", date:"December 2025 · Verified"},
            ].map((r,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"8px",padding:"12px",marginBottom:"8px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
                  <span style={{fontSize:"13px",fontWeight:500,color:"#e2d9f3"}}>{r.name}</span>
                  <span style={{color:"#f59e0b",fontSize:"12px"}}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</span>
                </div>
                <div style={{fontSize:"12px",color:"#9ca3af",lineHeight:1.5}}>{r.text}</div>
                <div style={{fontSize:"11px",color:"#4b5563",marginTop:"4px"}}>{r.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust row — no refund mention */}
      <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"0 1.75rem 0.75rem",flexWrap:"wrap"}}>
        {["Instant download","No account needed","AI-personalised for you"].map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"11px",color:"#6b7280"}}>
            <div style={{width:"5px",height:"5px",background:"#22c55e",borderRadius:"50%"}}/>
            {t}
          </div>
        ))}
      </div>

      {/* Buy bar */}
      <div style={{background:"rgba(13,10,26,0.97)",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"1rem 1.75rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",flexWrap:"wrap"}}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",gap:"8px"}}>
            <span style={{fontSize:"22px",fontWeight:700}}>₹499</span>
            <span style={{fontSize:"13px",color:"#6b7280",textDecoration:"line-through"}}>₹999</span>
          </div>
          <div style={{fontSize:"11px",color:"#86efac",marginTop:"1px"}}>50% off · Limited time</div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={()=>setSaved(s=>!s)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",color:saved?"#f472b6":"#c084fc",padding:"10px 14px",borderRadius:"10px",fontSize:"13px",cursor:"pointer"}}>
            {saved ? "♥ Saved" : "♡ Save"}
          </button>
          <button onClick={onUnlock} style={{background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",border:"none",padding:"11px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>
            Add to Cart →
          </button>
        </div>
      </div>
    </div>
  );
}
