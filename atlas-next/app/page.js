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
            <p className="eyebrow eyebrow--electric">From information age to agency age</p>
            <h1>
              STOP HUNTING FOR PRODUCTS.
              <span className="outline-word"> START WITH</span>
              <span className="accent-word"> INTENT.</span>
            </h1>
            <p className="intent-hero-text">
              The Digital Atlas is now an AI-first generation partner. Instead of browsing a wall of products,
              customers describe the outcome they want and the app turns that into a concrete digital direction, a free
              starter sample, and a full editable bundle when they need more depth.
            </p>
            <div className="intent-signal-strip">
              <span>Mental decluttering</span>
              <span>Intent to execution</span>
              <span>Printable + editable</span>
              <span>Free sample first</span>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="#intent-form">
                Start the AI workspace
              </Link>
              <Link className="button button-secondary" href="/about">
                See the product vision
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
              <p className="eyebrow">Intent detected</p>
              <h3>"I have a budget, a deadline, and too many moving pieces."</h3>
              <div className="intent-orbit-pills">
                <span>clarity</span>
                <span>certainty</span>
                <span>execution</span>
              </div>
            </div>
            <div className="intent-orbit-card intent-orbit-card--secondary" data-tilt>
              <p className="eyebrow">The AI layer returns</p>
              <ul className="feature-list compact-detail-list">
                <li>One clear output direction</li>
                <li>A free starter sample</li>
                <li>A paid editable full bundle</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block intent-summary-grid" data-reveal>
        <article className="info-card intent-summary-card">
          <p className="eyebrow eyebrow--electric">What changed</p>
          <h3>The storefront has been replaced by an AI product factory.</h3>
          <p>
            The homepage now does the heavy lifting. Customers explain what they need, the app narrows the direction,
            and the first useful output appears without forcing anyone through a catalog maze.
          </p>
        </article>
        <article className="info-card intent-summary-card">
          <p className="eyebrow eyebrow--electric">What customers get</p>
          <h3>Free proof first. Paid depth when it actually helps.</h3>
          <p>
            Each generation session starts with a free sample and a structured idea brief, then unlocks the full
            printable and editable bundle through checkout only when the direction feels right.
          </p>
        </article>
        <article className="info-card intent-summary-card">
          <p className="eyebrow eyebrow--electric">Where this starts</p>
          <h3>One sentence about the outcome they want.</h3>
          <p>
            Weddings, parties, business setup, and life systems all begin the same way: describe the job to be done
            and let the app translate it into a real downloadable direction.
          </p>
        </article>
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
          <h2>Describe the pressure point.</h2>
          <p>Budget, timing, audience, and desired outcome are enough for the workspace to understand the job.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 2</p>
          <h2>Get a focused generation direction.</h2>
          <p>The AI returns a safer template family, suggested deliverables, and a calm next-step structure.</p>
        </article>
        <article className="catalog-card intent-process-card" data-tilt>
          <p className="eyebrow eyebrow--electric">Step 3</p>
          <h2>Download the proof, then unlock the bundle.</h2>
          <p>Take the free sample immediately or move into the paid full-bundle path for editable master files.</p>
        </article>
      </section>

      <section className="section-block intent-bottom-band" data-reveal>
        <article className="catalog-card intent-bottom-card">
          <p className="eyebrow eyebrow--electric">Agency, not more tabs</p>
          <h2>The real product is certainty.</h2>
          <p>
            This first release is intentionally focused on high-stress scenarios where digital outputs reduce chaos:
            wedding logistics, event planning, small business setup, and clutter-clearing systems.
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
          <h3>Open-ended intent at the front door. Deterministic template generation underneath.</h3>
          <p>
            The experience feels like an AI partner, while real generation rules, checkout, and file delivery stay
            grounded in bounded template families the app can reliably produce.
          </p>
        </article>
      </section>
    </div>
  );
}
