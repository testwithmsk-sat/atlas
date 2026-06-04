"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { CreatorProductPreview } from "@/components/creator-product-preview";
import { useCart } from "@/components/cart-provider";

const CATEGORIES = [
  { key: "wedding",  icon: "💍", label: "Wedding",     sub: "Planning kits" },
  { key: "event",    icon: "🎉", label: "Events",      sub: "Party & hosting" },
  { key: "business", icon: "💼", label: "Business",    sub: "Templates & kits" },
  { key: "home",     icon: "🏠", label: "Home & Life", sub: "Organisation" },
];

const EXAMPLES = [
  { label: "Budget bride 🌸", text: "Budget bride planning a 60-person garden wedding in spring, needs checklist and budget tracker" },
  { label: "Birthday host 🎂", text: "Planning a 40th birthday dinner party for 20 guests, need a menu planner and seating layout" },
  { label: "Freelancer launch 🚀", text: "Launching a freelance design studio, need a client onboarding kit and project proposal template" },
  { label: "Home reset 🏡", text: "Resetting our home organisation system for a family of 4, need cleaning schedules and meal planners" },
];

const FORMAT_ICONS = { PDF: "📄", XLSX: "📊", DOCX: "📝", PNG: "🖼️", Checklist: "✅" };

const SYSTEM_PROMPT = `You are a digital product planning AI for The Digital Atlas.
When given a user's goal, generate a complete digital product direction.

Respond ONLY in this exact JSON format with no markdown, no preamble, no trailing text:
{
  "title": "Specific product title (max 8 words, include their event/goal)",
  "description": "2 sentences — warm, specific, actionable. Mention their event details.",
  "formats": ["PDF","XLSX","DOCX"],
  "summary": "150-word planning direction. Be specific to their goal. Include 3 concrete recommendations. Warm, expert tone. NO JSON — plain text only.",
  "samples": [
    {"emoji":"📋","name":"Specific document name","desc":"What this document contains"},
    {"emoji":"💰","name":"Specific document name","desc":"What this document contains"},
    {"emoji":"📅","name":"Specific document name","desc":"What this document contains"},
    {"emoji":"✉️","name":"Specific document name","desc":"What this document contains"}
  ],
  "preview": {
    "checklist": [
      "Specific task 1 tailored to their goal",
      "Specific task 2",
      "Specific task 3",
      "Specific task 4",
      "Specific task 5",
      "Specific task 6",
      "Specific task 7",
      "Specific task 8"
    ],
    "timeline": [
      {"phase": "Week 1", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 2", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 4", "task": "Specific task", "detail": "Tip"},
      {"phase": "Week 8", "task": "Specific task", "detail": "Tip"},
      {"phase": "2 Weeks Before", "task": "Specific task", "detail": "Tip"},
      {"phase": "Day Before", "task": "Specific task", "detail": "Tip"},
      {"phase": "Day Of", "task": "Specific task", "detail": "Tip"}
    ],
    "budget": [
      {"category": "Specific category", "estimated": "Amount", "status": "Pending"},
      {"category": "Specific category", "estimated": "Amount", "status": "Pending"},
      {"category": "Specific category", "estimated": "Amount", "status": "Pending"},
      {"category": "Specific category", "estimated": "Amount", "status": "Pending"},
      {"category": "Specific category", "estimated": "Amount", "status": "Pending"}
    ]
  }
}`;

// ── Preview renderers ─────────────────────────────────────────────────────────
const NAVY = "#1B2A4A";
const GOLD = "#C9A84C";
const OFF  = "#F8F6F2";
const ACC  = "#F0ECD8";

function ChecklistPreview({ items = [], title }) {
  const [ticked, setTicked] = useState({});
  const done = Object.values(ticked).filter(Boolean).length;
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[["Total", items.length, "#666", "#f0f0f0"], ["Done", done, "#3B6D11", "#EAF3DE"], ["Left", items.length - done, "#854F0B", "#FAEEDA"]].map(([l,v,c,bg]) => (
          <div key={l} style={{ flex: 1, background: bg, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: c, fontFamily: "sans-serif" }}>{v}</div>
            <div style={{ fontSize: "10px", color: c, fontFamily: "sans-serif" }}>{l}</div>
          </div>
        ))}
      </div>
      {items.map((item, i) => {
        const isDone = ticked[i];
        return (
          <div key={i} onClick={() => setTicked(p => ({ ...p, [i]: !p[i] }))}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0",
              borderBottom: "0.5px solid #f0ede6", cursor: "pointer", fontFamily: "sans-serif" }}>
            <div style={{ width: "16px", height: "16px", border: `2px solid ${isDone ? NAVY : "#ddd"}`,
              borderRadius: "4px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: isDone ? NAVY : "#fff" }}>
              {isDone && <span style={{ color: "#fff", fontSize: "10px" }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: "12.5px", color: isDone ? "#aaa" : NAVY,
              textDecoration: isDone ? "line-through" : "none" }}>{item}</span>
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600,
              background: isDone ? "#EAF3DE" : "#FAEEDA", color: isDone ? "#3B6D11" : "#854F0B" }}>
              {isDone ? "Done" : "Pending"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TimelinePreview({ steps = [] }) {
  return (
    <div style={{ padding: "20px 24px", position: "relative" }}>
      <div style={{ position: "absolute", left: "36px", top: "24px", bottom: "24px", width: "2px", background: "#f0ede6" }} />
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "16px", position: "relative" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: GOLD,
            border: `2px solid ${NAVY}`, flexShrink: 0, marginTop: "3px", zIndex: 1 }} />
          <div style={{ fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "10px", color: GOLD, fontWeight: 700, letterSpacing: ".08em",
              textTransform: "uppercase", marginBottom: "2px" }}>{step.phase}</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: NAVY }}>{step.task}</div>
            {step.detail && <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{step.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetPreview({ rows = [] }) {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
        {[["Total Budget", "—"], ["Confirmed", "₹0"], ["Remaining", "—"]].map(([l, v]) => (
          <div key={l} style={{ background: ACC, borderRadius: "8px", padding: "8px 10px" }}>
            <div style={{ fontSize: "10px", color: "#999", fontFamily: "sans-serif" }}>{l}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "sans-serif", color: NAVY }}>{v}</div>
          </div>
        ))}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", fontFamily: "sans-serif" }}>
        <thead>
          <tr style={{ background: NAVY }}>
            {["Category", "Estimated", "Status"].map(h => (
              <th key={h} style={{ padding: "7px 10px", color: GOLD, textAlign: "left", fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : OFF, borderBottom: "0.5px solid #ede9e0" }}>
              <td style={{ padding: "7px 10px", fontWeight: 600, color: NAVY }}>{row.category}</td>
              <td style={{ padding: "7px 10px", color: "#555" }}>{row.estimated}</td>
              <td style={{ padding: "7px 10px" }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600,
                  background: /booked|confirmed|done/i.test(row.status) ? "#EAF3DE" : "#FAEEDA",
                  color: /booked|confirmed|done/i.test(row.status) ? "#3B6D11" : "#854F0B" }}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Product preview card ──────────────────────────────────────────────────────
function ProductPreviewCard({ output, goal, userId, onUnlock }) {
  const tabs = [
    { key: "checklist", label: "✅ Checklist",  show: output?.preview?.checklist?.length > 0 },
    { key: "timeline",  label: "🗓️ Timeline",   show: output?.preview?.timeline?.length > 0 },
    { key: "budget",    label: "📊 Budget",     show: output?.preview?.budget?.length > 0 },
  ].filter(t => t.show);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "checklist");
  const activeDocName = output?.samples?.find(s =>
    activeTab === "checklist" ? /check|list|task/i.test(s.name) :
    activeTab === "timeline"  ? /time|plan|schedule/i.test(s.name) :
    /budget|cost|finance/i.test(s.name)
  )?.name ?? output?.samples?.[0]?.name ?? "preview";

  return (
    <div style={{ marginBottom: "1.5rem" }}>

      {/* Success banner */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px",
        borderRadius: "10px", background: "#EAF3DE", border: "1px solid #C0DD97", marginBottom: "20px" }}>
        <span style={{ fontSize: "18px" }}>✅</span>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3B6D11", fontFamily: "sans-serif" }}>
            Your product is ready — here's a live preview
          </div>
          <div style={{ fontSize: "11px", color: "#5a9b2a", fontFamily: "sans-serif" }}>
            AI-generated for: {goal}
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: NAVY, marginBottom: "6px" }}>
        {output.title}
      </h2>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "14px", lineHeight: 1.55, fontFamily: "sans-serif" }}>
        {output.description}
      </p>

      {/* Format pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {(output.formats || []).map(f => (
          <span key={f} style={{ display: "flex", alignItems: "center", gap: "5px",
            padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(27,42,74,0.15)",
            fontSize: "12px", fontWeight: 500, color: "#555", background: "#fff", fontFamily: "sans-serif" }}>
            {FORMAT_ICONS[f] ?? "📄"} {f}
          </span>
        ))}
      </div>

      {/* Document tabs */}
      {tabs.length > 0 && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "7px 16px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600,
              background: activeTab === tab.key ? NAVY : "#fff",
              color: activeTab === tab.key ? "#fff" : "#555",
              boxShadow: activeTab === tab.key ? "none" : "0 1px 4px rgba(0,0,0,0.08)"
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Browser window */}
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
            {activeDocName.toLowerCase().replace(/\s+/g, "-")}.{activeTab === "budget" ? "xlsx" : "pdf"} · Free sample preview
          </div>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
            background: "#F0ECD8", color: NAVY, fontWeight: 700, fontFamily: "sans-serif" }}>
            SAMPLE
          </span>
        </div>

        {/* Document header */}
        <div style={{ background: NAVY, padding: "10px 24px" }}>
          <span style={{ color: GOLD, fontSize: "10px", fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", fontFamily: "sans-serif" }}>
            The Digital Atlas · {output.title}
          </span>
        </div>

        {/* Document content */}
        <div style={{ background: "#fff", maxHeight: "440px", overflowY: "auto" }}>
          {activeTab === "checklist" && <ChecklistPreview items={output.preview.checklist} />}
          {activeTab === "timeline"  && <TimelinePreview  steps={output.preview.timeline} />}
          {activeTab === "budget"    && <BudgetPreview    rows={output.preview.budget} />}
        </div>
      </div>

      {/* What's included */}
      <div style={{ background: OFF, borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em",
          color: "#888", marginBottom: "12px", fontFamily: "sans-serif" }}>
          Full bundle includes
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "8px" }}>
          {(output.samples || []).map(s => (
            <div key={s.name} style={{ background: "#fff", borderRadius: "10px", padding: "12px",
              border: "1px solid rgba(27,42,74,0.08)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "20px", flexShrink: 0 }}>{s.emoji}</span>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: NAVY, fontFamily: "sans-serif" }}>{s.name}</div>
                <div style={{ fontSize: "10px", color: "#888", marginTop: "2px", fontFamily: "sans-serif" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lock note */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 14px",
        borderRadius: "10px", background: "rgba(27,42,74,0.04)", border: "0.5px solid rgba(27,42,74,0.1)",
        marginBottom: "16px", fontSize: "12px", color: "#666", fontFamily: "sans-serif" }}>
        <span>🔒</span>
        <span>This is a <strong>live sample preview</strong>. The full bundle includes all formats — fully editable, print-ready, and personalised to your exact goal.</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={onUnlock} style={{ padding: "12px 28px", background: GOLD, color: NAVY,
          border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "15px",
          cursor: "pointer", fontFamily: "sans-serif" }}>
          👑 Unlock Full Bundle — Buy Now
        </button>
        <span style={{ fontSize: "11px", color: "#aaa", fontFamily: "sans-serif" }}>
          🔒 Instant download after purchase
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AICreatorClient({ userId, initialProducts }) {
  const router = useRouter();
  const { addItem } = useCart();
  const supabase = env.supabaseUrl && env.supabaseAnonKey
    ? createBrowserClient(env.supabaseUrl, env.supabaseAnonKey) : null;

  const [selectedCat, setSelectedCat] = useState("");
  const [goal, setGoal]               = useState("");
  const [budget, setBudget]           = useState("");
  const [format, setFormat]           = useState("");
  const [audience, setAudience]       = useState("");
  const [timing, setTiming]           = useState("");

  const [view, setView]               = useState("create");
  const [loading, setLoading]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [toastMsg, setToastMsg]       = useState("");
  const [showToast, setShowToast]     = useState(false);

  const [output, setOutput]                   = useState(null);
  const [streamedSummary, setStreamedSummary] = useState("");
  const [refineText, setRefineText]           = useState("");
  const [refining, setRefining]               = useState(false);
  const [savedProducts, setSavedProducts]     = useState(initialProducts);

  const goalRef           = useRef(null);
  const currentGoalRef    = useRef("");
  const creatorSessionRef = useRef(""); // stores session created from creator output

  // ── Add to cart from creator flow ─────────────────────────────────────────
  async function addToCartAndCheckout() {
    if (!output) return;
    setLoading(true);
    toast("Preparing your bundle…");

    try {
      // Create a real workspace session from the creator output
      const intentRes = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentGoalRef.current || output.title,
          useCaseType: selectedCat || "general",
          audience: audience,
          timeline: timing,
          budget: budget,
          style: format,
        }),
      });

      const intentData = await intentRes.json().catch(() => ({}));
      const sessionId = intentData?.sessionId || "";
      const sessionToken = intentData?.sessionToken || "";

      if (!sessionId) throw new Error("Could not create bundle session.");

      creatorSessionRef.current = sessionId;

      // Add to cart with real sessionId + token for session recovery
      addItem({
        kind: "generated_bundle",
        sessionId,
        sessionToken,
        name: output.title || "AI Digital Planning Bundle",
        priceLabel: "₹499",
        priceValue: 499,
        includedFormats: output.formats || ["PDF", "XLSX", "DOCX"],
        deliverables: (output.samples || []).map(s => s.name),
        image: "",
        status: "AI-generated premium bundle",
      });

      toast("Added to cart! Redirecting…");
      setTimeout(() => {
        router.push(`/checkout${sessionToken ? `?t=${sessionToken}` : ""}`);
      }, 800);
    } catch (err) {
      toast(err?.message || "Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toast(msg) {
    setToastMsg(msg); setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  }

  function animateProgress() {
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(iv); return p; } return p + Math.random() * 8; });
    }, 200);
    return iv;
  }

  function streamText(text, setter) {
    setter(""); let i = 0;
    const iv = setInterval(() => {
      if (i >= text.length) { clearInterval(iv); return; }
      setter(prev => prev + text[i++]);
    }, 12);
  }

  async function callAI(messages, system) {
    const res = await fetch("/api/creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `${res.status}`); }
    const data = await res.json();
    return data.text ?? "";
  }

  async function saveProduct(data) {
    if (!userId || !supabase) return;
    const { data: saved, error } = await supabase.from("digital_products")
      .insert({ user_id: userId, goal: currentGoalRef.current, category: selectedCat || "general", title: data.title, output: data })
      .select().single();
    if (!error && saved) { setSavedProducts(prev => [saved, ...prev]); toast("Product saved!"); }
  }

  async function handleGenerate() {
    if (!goal.trim()) {
      goalRef.current?.focus();
      goalRef.current?.classList.add("creator-input-error");
      setTimeout(() => goalRef.current?.classList.remove("creator-input-error"), 1500);
      return;
    }
    currentGoalRef.current = goal;
    setLoading(true); setView("output"); setOutput(null); setStreamedSummary("");
    const progressTimer = animateProgress();
    const userMsg = [
      `Category: ${selectedCat || "general"}`,
      `Goal: ${goal}`,
      budget   && `Budget: ${budget}`,
      format   && `Preferred format: ${format}`,
      audience && `Audience: ${audience}`,
      timing   && `Timing: ${timing}`,
    ].filter(Boolean).join("\n");

    try {
      const text = await callAI([{ role: "user", content: userMsg }], SYSTEM_PROMPT);

      // Strip markdown fences Gemini sometimes adds
      const clean = text
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "").trim();

      // Extract JSON block
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      let parsed;
      try {
        parsed = JSON.parse(jsonMatch?.[0] ?? clean);

        // Guard: if summary contains JSON (Gemini sometimes echoes structure), replace it
        if (
          !parsed.summary ||
          parsed.summary.trim().startsWith("{") ||
          parsed.summary.includes('"title"') ||
          parsed.summary.includes('"checklist"')
        ) {
          parsed.summary = `Your ${parsed.title || "planning kit"} is ready. ${parsed.description || "This personalised bundle is built around your exact goal."}`;
        }

        // Ensure preview exists with at least empty arrays
        if (!parsed.preview) parsed.preview = {};
        if (!Array.isArray(parsed.preview.checklist)) parsed.preview.checklist = [];
        if (!Array.isArray(parsed.preview.timeline))  parsed.preview.timeline  = [];
        if (!Array.isArray(parsed.preview.budget))    parsed.preview.budget    = [];

      } catch {
        // fallback structure if JSON parse fails entirely
        parsed = {
          title: "Your personalised planning kit",
          description: "A focused digital bundle built around your goal.",
          formats: ["PDF", "XLSX", "DOCX"],
          summary: clean.replace(/\{[\s\S]*\}/, "").trim().slice(0, 400) || "Your personalised planning guide is ready.",
          samples: [
            { emoji: "📋", name: "Master checklist",  desc: "Step-by-step tasks" },
            { emoji: "💰", name: "Budget tracker",    desc: "Cost tracking sheet" },
            { emoji: "📅", name: "Timeline planner",  desc: "Week-by-week plan" },
            { emoji: "✉️", name: "Contact sheet",     desc: "Vendor contacts" },
          ],
          preview: {
            checklist: ["Set overall goal and budget", "Research options", "Make a shortlist", "Book key vendors", "Confirm details", "Final review", "Day-of checklist", "Follow-up tasks"],
            timeline: [
              { phase: "Week 1", task: "Initial planning", detail: "Set your budget and priorities" },
              { phase: "Week 2", task: "Research", detail: "Explore your options" },
              { phase: "Week 4", task: "Book vendors", detail: "Confirm your top choices" },
              { phase: "Final week", task: "Final checks", detail: "Confirm all details" },
            ],
            budget: [
              { category: "Primary expense", estimated: "TBD", status: "Pending" },
              { category: "Secondary expense", estimated: "TBD", status: "Pending" },
              { category: "Miscellaneous", estimated: "TBD", status: "Pending" },
            ]
          }
        };
      }
      clearInterval(progressTimer); setProgress(100);
      setOutput(parsed);
      if (parsed.summary) streamText(parsed.summary, setStreamedSummary);
      await saveProduct(parsed);
    } catch (err) {
      toast(String(err?.message || "Generation failed").slice(0, 80));
      setView("create");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine() {
    if (!refineText.trim() || !output) return;
    setRefining(true); setStreamedSummary("");
    try {
      const text = await callAI([{
        role: "user",
        content: `Original goal: ${currentGoalRef.current}\nRefinement: ${refineText}\n\nWrite a revised 150-word planning direction summary. Be specific and warm. Plain text only.`,
      }]);
      streamText(text, setStreamedSummary);
      setRefineText(""); toast("Direction refined!");
    } catch { toast("Refinement failed."); }
    finally { setRefining(false); }
  }

  return (
    <div className="creator-app">

      {/* Nav tabs */}
      <div className="creator-tabs">
        <button className={`creator-tab${view === "create" || view === "output" ? " creator-tab--active" : ""}`} onClick={() => setView("create")}>✨ Create</button>
        <button className={`creator-tab${view === "products" ? " creator-tab--active" : ""}`} onClick={() => setView("products")}>
          My Products {savedProducts.length > 0 && <span className="creator-badge">{savedProducts.length}</span>}
        </button>
      </div>

      {/* ── CREATE VIEW ── */}
      {view === "create" && (
        <div className="creator-create">
          <div className="page-intro creator-hero">
            <p className="eyebrow eyebrow--electric">✨ AI-powered product builder</p>
            <h1>Describe your goal.<br />Get a <em>digital product</em> instantly.</h1>
            <p>Tell us what you&apos;re planning — a wedding, a business launch, an event — and the AI turns it into a focused digital bundle you can use right away.</p>
          </div>

          <div className="creator-steps">
            {["Choose type","Describe goal","Get product"].map((label, i) => (
              <div key={label} className="creator-step-group">
                <div className={`creator-step${i===0&&selectedCat?" creator-step--done":i===0?" creator-step--active":""}`}>
                  <span className="creator-step-num">{i+1}</span><span>{label}</span>
                </div>
                {i < 2 && <div className="creator-step-line" />}
              </div>
            ))}
          </div>

          <div className="creator-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.key} className={`creator-cat-card${selectedCat===c.key?" creator-cat-card--selected":""}`} onClick={() => setSelectedCat(c.key)}>
                <span className="creator-cat-icon">{c.icon}</span>
                <span className="creator-cat-label">{c.label}</span>
                <span className="creator-cat-sub">{c.sub}</span>
              </button>
            ))}
          </div>

          <div className="info-card creator-card">
            <h3 className="creator-card-title">✏️ Describe your outcome</h3>
            <textarea ref={goalRef} className="creator-goal-input" value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="e.g. I'm planning a 120-person outdoor wedding in October and need a full planning checklist, seating chart, and budget tracker…" />
            <div className="catalog-chip-list creator-chips">
              {EXAMPLES.map(ex => (
                <button key={ex.label} className={`catalog-chip${goal===ex.text?" creator-chip--active":""}`} onClick={() => setGoal(ex.text)}>{ex.label}</button>
              ))}
            </div>
          </div>

          <div className="info-card creator-card">
            <h3 className="creator-card-title">⚙️ Refine the output <span className="creator-optional">(optional)</span></h3>
            <div className="creator-detail-grid">
              <div className="creator-field">
                <label className="creator-field-label">Budget range</label>
                <select className="creator-select" value={budget} onChange={e => setBudget(e.target.value)}>
                  <option value="">Any budget</option><option>Under ₹10,000</option>
                  <option>₹10,000–₹50,000</option><option>₹50,000–₹1,50,000</option><option>₹1,50,000+</option>
                </select>
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Output format</label>
                <select className="creator-select" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="">Best fit (auto)</option><option>PDF + checklist</option>
                  <option>Spreadsheet tracker</option><option>Word document</option><option>Full mixed bundle</option>
                </select>
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Audience / guests</label>
                <input className="creator-input" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. 80 guests, family-friendly" />
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Timing / urgency</label>
                <select className="creator-select" value={timing} onChange={e => setTiming(e.target.value)}>
                  <option value="">No rush</option><option>Within 2 weeks</option>
                  <option>Within a month</option><option>2–3 months away</option><option>6+ months away</option>
                </select>
              </div>
            </div>
          </div>

          <button className="button button-primary creator-generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? "Building…" : "✨ Build my digital product"}
          </button>
        </div>
      )}

      {/* ── OUTPUT VIEW ── */}
      {view === "output" && (
        <div className="creator-output">
          <div className="creator-output-header">
            <h2>Your AI-generated product</h2>
            <button className="button button-secondary creator-back-btn" onClick={() => setView("create")}>← Start over</button>
          </div>

          <div className="creator-progress-track">
            <div className="creator-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          {/* Direction card */}
          <div className="info-card creator-card">
            <span className="creator-dir-tag creator-dir-tag--premium">✨ AI direction</span>
            <h3 className="creator-dir-title">{output?.title ?? "Building your product…"}</h3>
            {output?.description && <p className="creator-dir-desc">{output.description}</p>}
            {output?.formats && (
              <div className="creator-format-badges">
                {output.formats.map(f => (
                  <span key={f} className="catalog-chip">{FORMAT_ICONS[f] ?? "📄"} {f}</span>
                ))}
              </div>
            )}
            <div className="creator-ai-response">
              {!output && !streamedSummary ? (
                <div className="creator-loading-row">
                  <span className="creator-dots"><span /><span /><span /></span>
                  AI is crafting your direction…
                </div>
              ) : (
                streamedSummary || <span className="creator-muted">Generating…</span>
              )}
            </div>
            <div className="creator-refine-bar">
              <input className="creator-refine-input" value={refineText} onChange={e => setRefineText(e.target.value)}
                placeholder="Ask the AI to adjust the direction, add sections, change tone…"
                onKeyDown={e => e.key === "Enter" && handleRefine()} />
              <button className="button button-secondary creator-refine-btn" onClick={handleRefine} disabled={refining}>
                {refining ? "…" : "↻ Refine"}
              </button>
            </div>
          </div>

          {/* LIVE PRODUCT PREVIEW */}
          {output?.samples && (
            <CreatorProductPreview
              output={output}
              userId={userId}
              onUnlock={addToCartAndCheckout}
              onRefine={() => document.querySelector(".creator-refine-input")?.focus()}
            />
          )}
        </div>
      )}

      {/* ── MY PRODUCTS VIEW ── */}
      {view === "products" && (
        <div className="creator-products">
          <div className="creator-output-header">
            <h2>My saved products</h2>
            <button className="button button-primary" onClick={() => setView("create")}>+ New product</button>
          </div>
          {!userId && <div className="creator-empty"><span className="creator-empty-icon">🔒</span><p>Sign in to save and access your past products.</p></div>}
          {userId && savedProducts.length === 0 && <div className="creator-empty"><span className="creator-empty-icon">📭</span><p>No products yet. Create your first one above!</p></div>}
          {userId && savedProducts.map(p => (
            <div key={p.id} className="info-card creator-product-row">
              <div className="creator-product-meta">
                <span className="creator-product-cat">{CATEGORIES.find(c => c.key === p.category)?.icon ?? "📦"}</span>
                <div>
                  <div className="creator-product-title">{p.title}</div>
                  <div className="creator-product-goal">{p.goal}</div>
                </div>
              </div>
              <button className="catalog-chip" onClick={() => {
                setOutput(p.output); setStreamedSummary(p.output?.summary ?? "");
                currentGoalRef.current = p.goal; setSelectedCat(p.category);
                setView("output"); setProgress(100);
              }}>View →</button>
            </div>
          ))}
        </div>
      )}

      {showToast && <div className="creator-toast">✓ {toastMsg}</div>}
    </div>
  );
}
