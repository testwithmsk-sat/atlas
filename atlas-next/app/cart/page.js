"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Cart</p>
        <h1>The cart is unavailable.</h1>
        <p>Because the storefront is empty, there are no products to review or purchase.</p>
      </div>

      <article className="info-card">
        <p className="eyebrow">No Active Shopping</p>
        <h2>Nothing can be added to the cart right now.</h2>
        <p>The storefront has been cleared, so checkout and cart actions are disabled by design.</p>
        <Link className="button button-primary" href="/shop">
          View Store Status
        </Link>
      </article>
    </section>
  );
}
