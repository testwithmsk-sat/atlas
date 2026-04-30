"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

const promptPresets = [
  {
    label: "Budget bride",
    prompt: "I have $500 and 2 months to plan a 50-person wedding and I need a calm printable kit with a checklist, budget tracker, and elegant guest-facing pieces."
  },
  {
    label: "Birthday host",
    prompt: "I need a digital party bundle with invitations, a planning checklist, a welcome sign, and a simple budget sheet."
  },
  {
    label: "Small business",
    prompt: "I want an editable business starter pack for onboarding, proposals, pricing, and client documents that still feels simple to use."
  },
  {
    label: "Home reset",
    prompt: "I want a low-stress digital system for routines, decluttering, and weekly planning with printable pages and a simple tracker."
  }
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
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              prompt,
              budget,
              timeline,
              audience,
              style,
              useCaseType
            })
          });

          const payload = await response.json().catch(() => ({}));
          if (!response.ok || !payload?.sessionId) {
            throw new Error(payload?.error || "The planning assistant could not build a generation session right now.");
          }

          router.push(`/workspace/${payload.sessionId}`);
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : "The planning assistant could not build a generation session right now.");
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  };

  return (
    <div className="intent-shell" data-reveal>
      <form className="intent-intake-form" onSubmit={handleSubmit}>
        <div className="intent-panel-head">
          <p className="eyebrow eyebrow--electric">Start with the outcome</p>
          <h2>Tell us what success looks like. The workspace will shape the right product around it.</h2>
          <p>
            One clear sentence is enough to begin. Add optional details if you want the first direction to land closer
            to your budget, audience, timing, and style.
          </p>
        </div>

        <div className="intent-form-layout">
          <div className="intent-main-column">
            <label className="intent-field intent-field--prompt">
              <span>Your goal in one sentence</span>
              <textarea
                rows={5}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Example: I need a printable wedding planning bundle with a budget tracker, checklists, and a few elegant guest-facing pages."
                required
              />
            </label>
            <p className="intent-form-hint">
              Start with the result, pressure point, or bundle outcome you want. The workspace can infer the best
              format from there.
            </p>
          </div>

          <aside className="intent-guide-card" aria-label="Helpful starting points">
            <p className="eyebrow eyebrow--electric">Helpful starting points</p>
            <ul className="intent-guide-list">
              <li>Lead with the outcome, not the file type.</li>
              <li>Mention urgency, audience, or tone only if it matters.</li>
              <li>The first sample should reduce uncertainty, not add options.</li>
            </ul>
            <div className="intent-chip-row">
              {promptPresets.map((preset) => (
                <button className="intent-chip" key={preset.label} type="button" onClick={() => setPrompt(preset.prompt)}>
                  {preset.label}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <div className="intent-details-block">
          <button
            className="intent-details-toggle"
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((currentValue) => !currentValue)}
          >
            {showDetails ? "Hide optional details" : "Add optional details"}
          </button>

          {showDetails ? (
            <div className="intent-details-grid">
              <label className="intent-field">
                <span>Budget</span>
                <input
                  type="text"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="$500, premium, low-cost, etc."
                />
              </label>
              <label className="intent-field">
                <span>Timeline</span>
                <input
                  type="text"
                  value={timeline}
                  onChange={(event) => setTimeline(event.target.value)}
                  placeholder="ASAP, 2 weeks, next month, etc."
                />
              </label>
              <label className="intent-field">
                <span>Audience</span>
                <input
                  type="text"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  placeholder="Bride and guests, clients, family, solo use, etc."
                />
              </label>
              <label className="intent-field">
                <span>Style</span>
                <input
                  type="text"
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  placeholder="Minimal, elegant, playful, formal, clean, etc."
                />
              </label>
              <label className="intent-field intent-field--wide">
                <span>Use case type</span>
                <input
                  type="text"
                  value={useCaseType}
                  onChange={(event) => setUseCaseType(event.target.value)}
                  placeholder="Wedding logistics, proposal template, party signage, weekly planner, etc."
                />
              </label>
            </div>
          ) : null}
        </div>

        {error ? <p className="status-note">{error}</p> : null}

        <div className="intent-actions">
          <button className="button button-primary intent-submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Building your workspace..." : "Build my first direction"}
          </button>
          <Link className="button button-secondary" href="/faq">
            See sample flows
          </Link>
        </div>
      </form>
    </div>
  );
}
