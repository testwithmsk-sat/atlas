import Link from "next/link";
import { IntentIntakeForm } from "@/components/intent-intake-form";

export const metadata = {
  title: "Intent-To-Output AI Workspace",
  description:
    "Describe a wedding, event, business, or life-planning goal and let The Digital Atlas turn it into a free sample and a paid editable bundle.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const initialPrompt = typeof params?.prompt === "string" ? params.prompt : "";
  const initialBudget = typeof params?.budget === "string" ? params.budget : "";
  const initialTimeline = typeof params?.timeline === "string" ? params.timeline : "";
  const initialAudience = typeof params?.audience === "string" ? params.audience : "";
  const initialStyle = typeof params?.style === "string" ? params.style : "";
  const initialUseCaseType = typeof params?.useCaseType === "string" ? params.useCaseType : "";
  const source = typeof params?.source === "string" ? params.source : "";

  return (
    <div className="intent-homepage">
      <section className="intent-hero-panel" data-reveal>
        <div className="intent-hero-grid">
          <div className="intent-hero-copy">
            <p className="eyebrow eyebrow--electric">Intent-first product planning</p>
            <h1>
              Describe the result.
              <span className="outline-word"> We shape the right</span>
              <span className="accent-word"> digital bundle.</span>
            </h1>
            <p className="intent-hero-text">
              Stop digging through shelves and trying to reverse-engineer the right product. Give The Digital Atlas the
              outcome you want and the workspace will turn it into a focused direction, a free starter sample, and a
              full editable bundle when you want depth.
            </p>
            <div className="intent-signal-strip">
              <span>One clear direction</span>
              <span>Free sample first</span>
              <span>Printable + editable</span>
              <span>Calmer decision-making</span>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="#intent-form">
                Start the workspace
              </Link>
              <Link className="button button-secondary" href="/faq">
                See sample flows
              </Link>
            </div>
            {source ? (
              <p className="intent-redirect-note">
                The old {source.replace(/-/g, " ")} route now flows into the AI workspace so customers start with
                goals, not product shelves.
              </p>
            ) : null}
          </div>

          <div className="intent-hero-stage" data-reveal>
            <div className="intent-orbit-card" data-tilt>
              <p className="eyebrow">What you get first</p>
              <h3>A cleaner path from vague idea to usable deliverable.</h3>
              <ul className="intent-proof-list">
                <li>A focused output direction based on the job to be done</li>
                <li>A free sample to validate the tone before you buy deeper</li>
                <li>A premium editable bundle when the direction feels right</li>
              </ul>
            </div>
            <div className="intent-orbit-card intent-orbit-card--secondary" data-tilt>
              <p className="eyebrow">Best used for</p>
              <div className="intent-orbit-pills">
                <span>Weddings</span>
                <span>Events</span>
                <span>Business kits</span>
                <span>Home systems</span>
              </div>
              <p className="intent-stage-note">
                Start with one sentence. Add budget, audience, style, and timing only if you want the first direction
                to feel more tailored.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="section-block intent-process-grid" data-reveal>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 1</p>
          <h2>Describe the outcome.</h2>
          <p>Start with the result you want, not the template name you think you need.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 2</p>
          <h2>Review the first direction.</h2>
          <p>The workspace narrows the format, tone, and deliverable path into something concrete and useful.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 3</p>
          <h2>Take the sample, then unlock the bundle.</h2>
          <p>Use the free proof to validate the direction and move into the editable bundle only when it helps.</p>
        </article>
      </section>

      <section className="section-block intent-bottom-band" data-reveal>
        <article className="catalog-card intent-bottom-card">
          <p className="eyebrow eyebrow--electric">Agency, not more tabs</p>
          <h2>The real product is clarity.</h2>
          <p>
            This workspace is built for the moments where too many moving pieces make good decisions harder:
            weddings, events, business setup, and calmer life systems.
          </p>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/about">
              Read the vision
            </Link>
            <Link className="catalog-chip" href="/faq">
              Samples and bundles FAQ
            </Link>
            <Link className="catalog-chip" href="/account">
              Account workspace
            </Link>
          </div>
        </article>
        <article className="info-card intent-bottom-note">
          <p className="eyebrow eyebrow--electric">Phase 1 focus</p>
          <h3>Open-ended intent at the top. Reliable template generation underneath.</h3>
          <p>
            The experience feels like an AI partner, while real generation rules, checkout, and file delivery stay
            grounded in bounded template families the app can reliably produce.
          </p>
        </article>
      </section>
    </div>
  );
}
