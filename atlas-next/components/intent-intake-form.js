"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

const promptPresets = [
  { label: "💍 Wedding planner", prompt: "I need a wedding planning bundle with a budget tracker, 12-month checklist, and guest list for 80 people in 4 months." },
  { label: "🎉 Birthday party", prompt: "I'm planning a birthday party for 30 people and need a run sheet, guest list, and fun invitation template." },
  { label: "💼 Freelance business", prompt: "I run a freelance design studio and need a client proposal template, invoice, and onboarding checklist." },
  { label: "🏠 Home reset", prompt: "I want a home organization system with weekly routines, a declutter checklist, and a simple habit tracker." },
  { label: "📋 Corporate event", prompt: "I'm organising a 100-person corporate conference and need a run sheet, speaker schedule, and attendee tracker." },
  { label: "🚀 Startup launch", prompt: "I'm launching a startup and need a pitch deck outline, go-to-market checklist, and investor one-pager template." },
];

export function IntentIntakeForm({
  initialPrompt = "",
  initialBudget = "",
  initialTimeline = "",
  initialAudience = "",
  initialStyle = "",
  initialUseCaseType = ""
}) {
  const router = useRouter();
  const hasInitialDetails = Boolean(initialBudget || initialTimeline || initialAudience || initialStyle || initialUseCaseType);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [budget, setBudget] = useState(initialBudget);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [audience, setAudience] = useState(initialAudience);
  const [style, setStyle] = useState(initialStyle);
  const [useCaseType, setUseCaseType] = useState(initialUseCaseType);
  const [showDetails, setShowDetails] = useState(hasInitialDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    startTransition(() => {
      void (async () => {
        setIsSubmitting(true);
        try {
          const response = await fetch("/api/intent", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ prompt, budget, timeline, audience, style, useCaseType })
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload?.sessionId) {
            throw new Error(payload?.error || "Could not generate your workspace. Please try again.");
          }
          router.push(`/ideas/${payload.sessionId}`);
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  return (
    <div className="intent-shell" data-reveal>
      <form className="intent-intake-form" onSubmit={handleSubmit}>

        {/* Header */}
        <div className="intent-panel-head">
          <p className="eyebrow eyebrow--electric">Free — no account needed</p>
          <h2>What do you need? Describe it in one sentence.</h2>
          <p>
            The more specific you are, the better the result. Try: <em>"I need a wedding budget tracker for 60 guests with a 6-month timeline and an elegant style."</em>
          </p>
        </div>

        {/* Quick-start presets */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>
            Quick starts
          </p>
          <div className="intent-chip-row" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
            {promptPresets.map((preset) => (
              <button
                className="intent-chip"
                key={preset.label}
                type="button"
                onClick={() => setPrompt(preset.prompt)}
                style={{ fontSize: "0.82rem", padding: "6px 14px" }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="intent-form-layout">
          {/* Main prompt */}
          <div className="intent-main-column">
            <label className="intent-field intent-field--prompt">
              <span>Your goal</span>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. I need a wedding planning kit with a budget tracker, checklist, and guest list for 80 people in 4 months."
                required
                style={{ resize: "vertical" }}
              />
            </label>

            {/* Character count hint */}
            <p className="intent-form-hint" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Be specific about your goal, timeline, audience, and style for the best output.</span>
              <span style={{ color: prompt.length > 20 ? "var(--sage)" : "var(--muted)" }}>
                {prompt.length > 20 ? "✓ Good length" : "Add more detail"}
              </span>
            </p>
          </div>

          {/* Guide card */}
          <aside className="intent-guide-card" aria-label="Tips for a great result">
            <p className="eyebrow eyebrow--electric">Tips for the best result</p>
            <ul className="intent-guide-list">
              <li><strong>Mention the occasion</strong> — wedding, birthday, business launch</li>
              <li><strong>Add a number</strong> — guests, pages, budget, timeline</li>
              <li><strong>Say the style</strong> — elegant, minimal, playful, professional</li>
              <li><strong>Name the deliverable</strong> — checklist, tracker, proposal, planner</li>
            </ul>
          </aside>
        </div>

        {/* Optional details toggle */}
        <div className="intent-details-block">
          <button
            className="intent-details-toggle"
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails(v => !v)}
          >
            {showDetails ? "▲ Hide optional refinements" : "▼ Add optional refinements (budget, style, audience)"}
          </button>

          {showDetails && (
            <div className="intent-details-grid">
              <label className="intent-field">
                <span>Budget</span>
                <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="$500, premium, shoestring, etc." />
              </label>
              <label className="intent-field">
                <span>Timeline</span>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} placeholder="ASAP, 2 weeks, 3 months, etc." />
              </label>
              <label className="intent-field">
                <span>Audience</span>
                <input type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="Clients, wedding guests, family, solo use, etc." />
              </label>
              <label className="intent-field">
                <span>Style preference</span>
                <input type="text" value={style} onChange={e => setStyle(e.target.value)} placeholder="Minimal, elegant, bold, playful, corporate, etc." />
              </label>
              <label className="intent-field intent-field--wide">
                <span>Specific use case</span>
                <input type="text" value={useCaseType} onChange={e => setUseCaseType(e.target.value)} placeholder="e.g. Wedding logistics, client onboarding, party signage, habit tracker" />
              </label>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: "rgba(217,126,162,0.12)",
            border: "1px solid rgba(217,126,162,0.3)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            color: "#8b2252",
            fontSize: "0.9rem",
            marginBottom: "1rem"
          }}>
            {error}
          </div>
        )}

        <div className="intent-actions">
          <button
            className="button button-primary intent-submit-button"
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            style={{ opacity: (!prompt.trim() && !isSubmitting) ? 0.6 : 1 }}
          >
            {isSubmitting ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "rotate-slow 0.8s linear infinite" }} />
                Building your workspace...
              </span>
            ) : "Generate my free sample →"}
          </button>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem" }}>
            Free. No credit card. No account required.
          </p>
        </div>
      </form>
    </div>
  );
}
