import { CheckoutSummary } from "@/components/checkout-summary";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Complete your wedding template order.</h1>
        <p>Review the current offer pricing, then use Razorpay to pay for your digital download order.</p>
        {status === "cancelled" ? (
          <p className="status-note">Checkout was cancelled, but your cart is still available.</p>
        ) : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Before you pay</h3>
          <ul className="feature-list">
            <li>Prices shown here use the active offer pricing.</li>
            <li>The bundle includes the customer how-to guide for fewer support questions.</li>
            <li>Products are digital only and ship as editable PDFs.</li>
            <li>Your cart stays saved if you cancel checkout.</li>
          </ul>
        </article>
        <CheckoutSummary />
      </div>
    </section>
  );
}
