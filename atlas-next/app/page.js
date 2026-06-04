import Link from "next/link";
import { IntentIntakeForm } from "@/components/intent-intake-form";

export const metadata = {
  title: "The Digital Atlas — AI-Powered Digital Product Generator",
  description:
    "Describe your goal in one sentence. Get a free PDF sample instantly. Unlock a full editable bundle for weddings, events, business, and life planning.",
  alternates: { canonical: "/" }
};

const USE_CASES = [
  { icon: "💍", label: "Wedding Planning", desc: "Checklists, budget trackers, invitations, seating charts" },
  { icon: "🎉", label: "Events & Parties", desc: "Run sheets, guest lists, invitations, welcome signs" },
  { icon: "💼", label: "Business Docs", desc: "Proposals, invoices, onboarding kits, pitch decks" },
  { icon: "🏠", label: "Life & Home", desc: "Routines, declutter guides, weekly planners, trackers" },
];

const TRUST_SIGNALS = [
  { stat: "Free", label: "starter sample, always" },
  { stat: "60s", label: "from goal to first file" },
  { stat: "PDF + DOCX + XLSX", label: "editable formats" },
  { stat: "100%", label: "AI-generated for your goal" },
];

const EXAMPLE_OUTPUTS = [
  {
    prompt: "Budget wedding, 50 guests, 3 months away",
    output: "12-Month Wedding Checklist + Budget Tracker + Guest List RSVP",
    tag: "Wedding",
    color: "#C9A84C"
  },
  {
    prompt: "Birthday party for my daughter, outdoor, 20 kids",
    output: "Party Run Sheet + Activity Planner + Invitation Template",
    tag: "Events",
    color: "#7aa186"
  },
  {
    prompt: "Freelance design studio, need client docs",
    output: "Proposal Template + Invoice + Client Onboarding Kit",
    tag: "Business",
    color: "#73a8d9"
  },
];

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const initialPrompt     = typeof params?.prompt      === "string" ? params.prompt      : "";
  const initialBudget     = typeof params?.budget      === "string" ? params.budget      : "";
  const initialTimeline   = typeof params?.timeline    === "string" ? params.timeline    : "";
  const initialAudience   = typeof params?.audience    === "string" ? params.audience    : "";
  const initialStyle      = typeof params?.style       === "string" ? params.style       : "";
  const initialUseCaseType= typeof params?.useCaseType === "string" ? params.useCaseType : "";

  return (
    <div className="intent-homepage">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="intent-hero-panel" data-reveal>
        <div className="intent-hero-grid">
          <div className="intent-hero-copy">
            <p className="eyebrow eyebrow--electric">AI Digital Product Generator</p>
            <h1>
              Describe your goal.
              <span className="outline-word"> Get a free sample.</span>
              <span className="accent-word"> Download your bundle.</span>
            </h1>
            <p className="intent-hero-text">
              Type what you need in one sentence — a wedding planner, a business proposal, a party kit — and The Digital Atlas builds a real, downloadable file around your goal. Free sample first. Full editable bundle when you're ready.
            </p>
            <div className="intent-signal-strip">
              {TRUST_SIGNALS.map(s => (
                <span key={s.label}>
                  <strong>{s.stat}</strong> {s.label}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="#intent-form">
                Generate my free sample →
              </Link>
              <Link className="button button-secondary" href="/faq">
                How it works
              </Link>
            </div>
          </div>

          {/* Hero right: live example cards */}
          <div className="intent-hero-stage" data-reveal>
            {EXAMPLE_OUTPUTS.map((ex) => (
              <div key={ex.tag} className="intent-orbit-card" data-tilt style={{ marginBottom: "1rem" }}>
                <p className="eyebrow" style={{ color: ex.color }}>
                  {ex.tag} example
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem", fontStyle: "italic" }}>
                  "{ex.prompt}"
                </p>
                <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>→ {ex.output}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────────── */}
      <section className="section-block" data-reveal>
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">What can you generate?</p>
            <h2>Digital products for every goal — made by AI, tailored to you.</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {USE_CASES.map(uc => (
            <div key={uc.label} className="catalog-card" data-tilt style={{ textAlign: "center", padding: "1.75rem 1.25rem" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>{uc.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{uc.label}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────────────── */}
      <section className="section-block" id="intent-form">
        <IntentIntakeForm
          initialPrompt={initialPrompt}
          initialBudget={initialBudget}
          initialTimeline={initialTimeline}
          initialAudience={initialAudience}
          initialStyle={initialStyle}
          initialUseCaseType={initialUseCaseType}
        />
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="section-block intent-process-grid" data-reveal>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 1</p>
          <h2>Describe the outcome.</h2>
          <p>One sentence is enough. Tell us what you need — a planner, a kit, a tracker — and we'll figure out the right format.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 2</p>
          <h2>Get your free sample instantly.</h2>
          <p>In under a minute, a real AI-generated PDF lands — built around your exact goal, not a generic template.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 3</p>
          <h2>Unlock the full editable bundle.</h2>
          <p>Love the direction? Unlock the complete version — PDF, DOCX, and XLSX — all editable and ready to use.</p>
        </article>
      </section>

      {/* ── SOCIAL PROOF / TRUST ─────────────────────────────────────── */}
      <section className="section-block intent-bottom-band" data-reveal>
        <article className="catalog-card intent-bottom-card">
          <p className="eyebrow eyebrow--electric">Why The Digital Atlas</p>
          <h2>Stop searching. Start describing.</h2>
          <p>
            Generic template marketplaces make you browse thousands of products hoping one fits. The Digital Atlas flips that — you describe what you need, and AI builds it for you in seconds. Every file is generated fresh for your specific goal.
          </p>
          <div className="catalog-chip-list" style={{ marginTop: "1.25rem" }}>
            <Link className="catalog-chip" href="#intent-form">Try it free →</Link>
            <Link className="catalog-chip" href="/faq">See how it works</Link>
            <Link className="catalog-chip" href="/about">About The Digital Atlas</Link>
          </div>
        </article>
        <article className="info-card intent-bottom-note">
          <p className="eyebrow eyebrow--electric">Always free to start</p>
          <h3>No account needed. No credit card. Just describe your goal and download.</h3>
          <p>
            Every workspace generates a free starter PDF. Create an account to save your workspaces and revisit your files anytime. Unlock the full bundle only when the direction feels right.
          </p>
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {["Free sample PDF — always included", "Full PDF + DOCX + XLSX bundle available", "Saved to your account automatically", "Works for weddings, events, business & home"].map(f => (
              <div key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.88rem" }}>
                <span style={{ color: "#C9A84C", fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="section-block" data-reveal style={{ textAlign: "center", padding: "3rem 0" }}>
        <p className="eyebrow eyebrow--electric" style={{ marginBottom: "0.75rem" }}>Ready?</p>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Your free sample is one sentence away.</h2>
        <p style={{ color: "var(--muted)", marginBottom: "1.75rem", maxWidth: "480px", margin: "0 auto 1.75rem" }}>
          Describe your goal above and get a professionally designed, AI-generated PDF in under 60 seconds.
        </p>
        <Link className="button button-primary" href="#intent-form" style={{ fontSize: "1rem", padding: "14px 32px" }}>
          Generate my free sample →
        </Link>
      </section>

    </div>
  );
}
