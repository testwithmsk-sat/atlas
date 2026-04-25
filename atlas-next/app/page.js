import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Site Update</p>
          <h1>The website is currently empty.</h1>
          <p className="hero-text">
            All previews and listing sections have been removed. The site is staying clear until future updates are
            ready.
          </p>
          <div className="trust-strip">
            <span>No active listings</span>
            <span>No previews</span>
            <span>Ready for future updates</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              View Store Status
            </Link>
            <Link className="button button-secondary" href="/account">
              Open Account
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Current State</p>
          <div className="hero-panel-stat">
            <strong>Site cleared</strong>
            <span>The site has been intentionally emptied so no listing-related content is visible.</span>
          </div>
          <ul className="feature-list">
            <li>No featured sections are displayed.</li>
            <li>No category previews are displayed.</li>
            <li>No sales-focused sections are displayed.</li>
            <li>Detail pages are unavailable.</li>
          </ul>
        </div>
      </section>

      <section className="section-block editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">Empty State</p>
          <h3>There is nothing for visitors to browse right now.</h3>
          <p>
            This homepage now acts as a simple empty-state landing page instead of showing promotional or preview
            sections.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Next Step</p>
          <h3>Future updates can be added later from a clean baseline.</h3>
          <p>
            When you are ready to change the site again, it can be expanded without keeping old listing UI online.
          </p>
        </article>
      </section>
    </>
  );
}
