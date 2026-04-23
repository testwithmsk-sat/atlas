import { CheckoutSummary } from "@/components/checkout-summary";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>In-site payment flow starts here.</h1>
        <p>
          This page is the placeholder for your future native checkout. The next implementation layer should add
          Razorpay checkout, customer email capture, order creation, and digital file delivery.
        </p>
        {status === "cancelled" ? <p className="status-note">Checkout was cancelled. Your cart is still available.</p> : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>What gets added next</h3>
          <ul className="feature-list">
            <li>Razorpay checkout modal</li>
            <li>Customer contact details</li>
            <li>Order record creation</li>
            <li>Automatic download access after payment</li>
          </ul>
        </article>
        <CheckoutSummary />
      </div>
    </section>
  );
}
