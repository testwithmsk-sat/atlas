"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

// ── Types (JSDoc) ─────────────────────────────────────────────────────────────

/**
 * @typedef {{ emoji: string, name: string, desc: string }} Sample
 * @typedef {{ title: string, description: string, formats: string[], summary: string, samples: Sample[] }} ProductOutput
 * @typedef {{ id: string, title: string, goal: string, category: string, created_at: string, output: ProductOutput }} SavedProduct
 */

// ── Constants ─────────────────────────────────────────────────────────────────

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

const SYSTEM_PROMPT = `You are a digital product planning AI for The Digital Atlas. When given a user's goal, you:
1. Generate a clear, focused product direction title (max 8 words)
2. Write a 2-sentence product description that feels personal and actionable
3. List 3-4 appropriate file formats from: PDF, DOCX, XLSX, PNG, Checklist
4. Write a detailed 150-word AI direction summary that feels like a smart planning partner — specific, warm, action-oriented. Include 2-3 concrete suggestions tailored to their goal.
5. List 4 sample bundle items with emoji and short description

Respond ONLY in this exact JSON format with no markdown or preamble:
{
  "title": "...",
  "description": "...",
  "formats": ["PDF","XLSX"],
  "summary": "...",
  "samples": [
    {"emoji":"📋","name":"...","desc":"..."},
    {"emoji":"💰","name":"...","desc":"..."},
    {"emoji":"📅","name":"...","desc":"..."},
    {"emoji":"✉️","name":"...","desc":"..."}
  ]
}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function AICreatorClient({ userId, initialProducts }) {
  const supabase =
    env.supabaseUrl && env.supabaseAnonKey
      ? createBrowserClient(env.supabaseUrl, env.supabaseAnonKey)
      : null;

  const [selectedCat, setSelectedCat] = useState("");
  const [goal, setGoal]               = useState("");
  const [budget, setBudget]           = useState("");
  const [format, setFormat]           = useState("");
  const [audience, setAudience]       = useState("");
  const [timing, setTiming]           = useState("");

  const [view, setView]               = useState("create"); // create | output | products
  const [loading, setLoading]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [toastMsg, setToastMsg]       = useState("");
  const [showToast, setShowToast]     = useState(false);

  const [output, setOutput]                   = useState(null);
  const [streamedSummary, setStreamedSummary] = useState("");
  const [refineText, setRefineText]           = useState("");
  const [refining, setRefining]               = useState(false);
  const [savedProducts, setSavedProducts]     = useState(initialProducts);

  const goalRef         = useRef(null);
  const currentGoalRef  = useRef("");

  // ── Helpers ────────────────────────────────────────────────────────────────

  function toast(msg) {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3200);
  }

  function animateProgress() {
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 85) { clearInterval(iv); return p; }
        return p + Math.random() * 8;
      });
    }, 200);
    return iv;
  }

  function streamText(text, setter) {
    setter("");
    let i = 0;
    const iv = setInterval(() => {
      if (i >= text.length) { clearInterval(iv); return; }
      setter(prev => prev + text[i++]);
    }, 14);
  }

  async function callClaude(messages, system) {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages };
    if (system) body.system = system;
    const res  = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.content?.map(b => b.text ?? "").join("") ?? "";
  }

  // ── Save to Supabase ────────────────────────────────────────────────────────

  async function saveProduct(data) {
    if (!userId || !supabase) return;
    const { data: saved, error } = await supabase
      .from("digital_products")
      .insert({ user_id: userId, goal: currentGoalRef.current, category: selectedCat || "general", title: data.title, output: data })
      .select()
      .single();
    if (!error && saved) {
      setSavedProducts(prev => [saved, ...prev]);
      toast("Product saved to your account!");
    }
  }

  // ── Generate ────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    if (!goal.trim()) {
      goalRef.current?.focus();
      goalRef.current?.classList.add("creator-input-error");
      setTimeout(() => goalRef.current?.classList.remove("creator-input-error"), 1500);
      return;
    }
    currentGoalRef.current = goal;
    setLoading(true);
    setView("output");
    setOutput(null);
    setStreamedSummary("");

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
      const text  = await callClaude([{ role: "user", content: userMsg }], SYSTEM_PROMPT);
      const clean = text.replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(clean); } catch {
        parsed = {
          title: "Your personalised planning kit",
          description: "A focused digital bundle built around your goal.",
          formats: ["PDF", "XLSX", "DOCX"],
          summary: text.slice(0, 400),
          samples: [
            { emoji: "📋", name: "Master checklist",  desc: "Step-by-step tasks from start to finish" },
            { emoji: "💰", name: "Budget tracker",    desc: "Real-time cost tracking spreadsheet" },
            { emoji: "📅", name: "Timeline planner",  desc: "Week-by-week milestone calendar" },
            { emoji: "✉️", name: "Contact sheet",     desc: "All vendors and contacts in one place" },
          ],
        };
      }
      clearInterval(progressTimer);
      setProgress(100);
      setOutput(parsed);
      streamText(parsed.summary, setStreamedSummary);
      await saveProduct(parsed);
    } catch {
      toast("Something went wrong. Please try again.");
      setView("create");
    } finally {
      setLoading(false);
    }
  }

  // ── Refine ──────────────────────────────────────────────────────────────────

  async function handleRefine() {
    if (!refineText.trim() || !output) return;
    setRefining(true);
    setStreamedSummary("");
    try {
      const text = await callClaude([{
        role: "user",
        content: `Original goal: ${currentGoalRef.current}\nRefinement: ${refineText}\n\nWrite a revised 150-word planning direction summary incorporating this refinement. Be specific and warm. Plain text only.`,
      }]);
      streamText(text, setStreamedSummary);
      setRefineText("");
      toast("Direction refined!");
    } catch {
      toast("Refinement failed. Please try again.");
    } finally {
      setRefining(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="creator-app">

      {/* ── Nav tabs ── */}
      <div className="creator-tabs">
        <button className={`creator-tab${view === "create" || view === "output" ? " creator-tab--active" : ""}`} onClick={() => setView("create")}>
          ✨ Create
        </button>
        <button className={`creator-tab${view === "products" ? " creator-tab--active" : ""}`} onClick={() => setView("products")}>
          My Products {savedProducts.length > 0 && <span className="creator-badge">{savedProducts.length}</span>}
        </button>
      </div>

      {/* ══════════════ CREATE VIEW ══════════════ */}
      {view === "create" && (
        <div className="creator-create">
          <div className="page-intro creator-hero">
            <p className="eyebrow eyebrow--electric">✨ AI-powered product builder</p>
            <h1>Describe your goal.<br />Get a <em>digital product</em> instantly.</h1>
            <p>Tell us what you&apos;re planning — a wedding, a business launch, an event — and the AI turns it into a focused digital bundle you can use right away.</p>
          </div>

          {/* Steps */}
          <div className="creator-steps">
            {["Choose type", "Describe goal", "Get product"].map((label, i) => (
              <div key={label} className="creator-step-group">
                <div className={`creator-step${i === 0 && selectedCat ? " creator-step--done" : i === 0 ? " creator-step--active" : ""}`}>
                  <span className="creator-step-num">{i + 1}</span>
                  <span>{label}</span>
                </div>
                {i < 2 && <div className="creator-step-line" />}
              </div>
            ))}
          </div>

          {/* Category grid */}
          <div className="creator-cat-grid">
            {CATEGORIES.map(c => (
              <button key={c.key}
                className={`creator-cat-card${selectedCat === c.key ? " creator-cat-card--selected" : ""}`}
                onClick={() => setSelectedCat(c.key)}
              >
                <span className="creator-cat-icon">{c.icon}</span>
                <span className="creator-cat-label">{c.label}</span>
                <span className="creator-cat-sub">{c.sub}</span>
              </button>
            ))}
          </div>

          {/* Goal input */}
          <div className="info-card creator-card">
            <h3 className="creator-card-title">✏️ Describe your outcome</h3>
            <textarea ref={goalRef} className="creator-goal-input" value={goal} onChange={e => setGoal(e.target.value)}
              placeholder="e.g. I'm planning a 120-person outdoor wedding in October and need a full planning checklist, seating chart, and budget tracker…"
            />
            <div className="catalog-chip-list creator-chips">
              {EXAMPLES.map(ex => (
                <button key={ex.label}
                  className={`catalog-chip${goal === ex.text ? " creator-chip--active" : ""}`}
                  onClick={() => setGoal(ex.text)}
                >{ex.label}</button>
              ))}
            </div>
          </div>

          {/* Optional details */}
          <div className="info-card creator-card">
            <h3 className="creator-card-title">⚙️ Refine the output <span className="creator-optional">(optional)</span></h3>
            <div className="creator-detail-grid">
              <div className="creator-field">
                <label className="creator-field-label">Budget range</label>
                <select className="creator-select" value={budget} onChange={e => setBudget(e.target.value)}>
                  <option value="">Any budget</option>
                  <option>Under ₹10,000</option>
                  <option>₹10,000–₹50,000</option>
                  <option>₹50,000–₹1,50,000</option>
                  <option>₹1,50,000+</option>
                </select>
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Output format</label>
                <select className="creator-select" value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="">Best fit (auto)</option>
                  <option>PDF + checklist</option>
                  <option>Spreadsheet tracker</option>
                  <option>Word document</option>
                  <option>Full mixed bundle</option>
                </select>
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Audience / guests</label>
                <input className="creator-input" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. 80 guests, family-friendly" />
              </div>
              <div className="creator-field">
                <label className="creator-field-label">Timing / urgency</label>
                <select className="creator-select" value={timing} onChange={e => setTiming(e.target.value)}>
                  <option value="">No rush</option>
                  <option>Within 2 weeks</option>
                  <option>Within a month</option>
                  <option>2–3 months away</option>
                  <option>6+ months away</option>
                </select>
              </div>
            </div>
          </div>

          <button className="button button-primary creator-generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? "Building…" : "✨ Build my digital product"}
          </button>
        </div>
      )}

      {/* ══════════════ OUTPUT VIEW ══════════════ */}
      {view === "output" && (
        <div className="creator-output">
          <div className="creator-output-header">
            <h2>Your AI-generated product</h2>
            <button className="button button-secondary creator-back-btn" onClick={() => setView("create")}>← Start over</button>
          </div>

          {/* Progress bar */}
          <div className="creator-progress-track">
            <div className="creator-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          {/* Free sample card */}
          <div className="info-card creator-card">
            <span className="creator-dir-tag creator-dir-tag--free">🎁 Free starter sample</span>
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
            {/* Refine bar */}
            <div className="creator-refine-bar">
              <input className="creator-refine-input" value={refineText} onChange={e => setRefineText(e.target.value)}
                placeholder="Ask the AI to adjust the direction, add sections, change tone…"
                onKeyDown={e => e.key === "Enter" && handleRefine()}
              />
              <button className="button button-secondary creator-refine-btn" onClick={handleRefine} disabled={refining}>
                {refining ? "…" : "↻ Refine"}
              </button>
            </div>
          </div>

          {/* Bundle preview card */}
          {output?.samples && (
            <div className="info-card creator-card">
              <span className="creator-dir-tag creator-dir-tag--premium">👑 Full bundle preview</span>
              <h3 className="creator-dir-title">What&apos;s in the complete bundle</h3>
              <div className="creator-samples-grid">
                {output.samples.map(s => (
                  <div key={s.name} className="creator-sample-card">
                    <span className="creator-sample-thumb">{s.emoji}</span>
                    <div>
                      <div className="creator-sample-name">{s.name}</div>
                      <div className="creator-sample-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="creator-action-row">
                <button className="button button-secondary" onClick={() => toast("Free sample downloading…")}>⬇️ Free sample</button>
                <button className="button button-primary" onClick={() => toast("Unlock the full bundle — pricing coming soon!")}>👑 Unlock full bundle</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ MY PRODUCTS VIEW ══════════════ */}
      {view === "products" && (
        <div className="creator-products">
          <div className="creator-output-header">
            <h2>My saved products</h2>
            <button className="button button-primary" onClick={() => setView("create")}>+ New product</button>
          </div>

          {!userId && (
            <div className="creator-empty">
              <span className="creator-empty-icon">🔒</span>
              <p>Sign in to save and access your past products.</p>
            </div>
          )}

          {userId && savedProducts.length === 0 && (
            <div className="creator-empty">
              <span className="creator-empty-icon">📭</span>
              <p>No products yet. Create your first one above!</p>
            </div>
          )}

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
                setOutput(p.output);
                setStreamedSummary(p.output.summary);
                currentGoalRef.current = p.goal;
                setSelectedCat(p.category);
                setView("output");
                setProgress(100);
              }}>View →</button>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {showToast && <div className="creator-toast">✓ {toastMsg}</div>}
    </div>
  );
}
