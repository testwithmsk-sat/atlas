import { CheckoutSummary } from "@/components/checkout-summary";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Secure checkout for your digital order.</h1>
        <p>Review your cart total and complete payment to confirm your purchase.</p>
        {status === "cancelled" ? <p className="status-note">Checkout was cancelled. Your cart is still available.</p> : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Before you pay</h3>
          <ul className="feature-list">
            <li>Double-check the products and quantity in your cart.</li>
            <li>Make sure your payment details are ready before launching Razorpay.</li>
            <li>Use the same email you want tied to your purchase history.</li>
            <li>After payment, return to your account to review your order.</li>
          </ul>
        </article>
        <CheckoutSummary />
      </div>
    </section>
  );
}
