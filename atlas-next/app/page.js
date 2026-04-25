import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Storefront Update</p>
          <h1>The website is currently empty.</h1>
          <p className="hero-text">
            All products, previews, and collection listings have been removed. The storefront is staying clear until
            new items are ready to publish.
          </p>
          <div className="trust-strip">
            <span>No live products</span>
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
            <strong>Catalog cleared</strong>
            <span>The storefront has been intentionally emptied so nothing product-related is visible.</span>
          </div>
          <ul className="feature-list">
            <li>No featured products are displayed.</li>
            <li>No category previews are displayed.</li>
            <li>No bundle or best-seller sections are displayed.</li>
            <li>Direct product pages are unavailable.</li>
          </ul>
        </div>
      </section>

      <section className="section-block editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">No Catalog</p>
          <h3>There is nothing for visitors to browse right now.</h3>
          <p>
            This homepage now acts as a simple empty-state landing page instead of showing product merchandising or
            shopping previews.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Next Step</p>
          <h3>New products can be added later from a clean baseline.</h3>
          <p>
            When you are ready to launch again, the site can be repopulated without keeping old product UI online.
          </p>
        </article>
      </section>
    </>
  );
}
