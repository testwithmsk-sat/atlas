import { CheckoutSummary } from "@/components/checkout-summary";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Checkout is currently unavailable.</h1>
        <p>The website is empty right now, so no orders can be placed.</p>
        {status === "cancelled" ? <p className="status-note">No checkout is currently active.</p> : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Storefront cleared</h3>
          <ul className="feature-list">
            <li>No products are listed for sale.</li>
            <li>No bundle or best-seller previews are shown.</li>
            <li>No cart total is available.</li>
            <li>Checkout can be re-enabled later when products return.</li>
          </ul>
        </article>
        <CheckoutSummary />
      </div>
    </section>
  );
}
