"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Status</p>
        <h1>This area is unavailable.</h1>
        <p>Because the site is empty, there is nothing to review here.</p>
      </div>

      <article className="info-card">
        <p className="eyebrow">Inactive</p>
        <h2>Nothing can be added here right now.</h2>
        <p>The site has been cleared, so this area is disabled by design.</p>
        <Link className="button button-primary" href="/shop">
          View Site Status
        </Link>
      </article>
    </section>
  );
}
