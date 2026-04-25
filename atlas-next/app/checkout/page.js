import { CheckoutSummary } from "@/components/checkout-summary";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Status</p>
        <h1>This area is currently unavailable.</h1>
        <p>The website is empty right now, so this flow is inactive.</p>
        {status === "cancelled" ? <p className="status-note">Nothing is currently active here.</p> : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Site cleared</h3>
          <ul className="feature-list">
            <li>No listing sections are active.</li>
            <li>No preview sections are shown.</li>
            <li>No totals or purchase steps are available.</li>
            <li>This area can be re-enabled later if needed.</li>
          </ul>
        </article>
        <CheckoutSummary />
      </div>
    </section>
  );
}
