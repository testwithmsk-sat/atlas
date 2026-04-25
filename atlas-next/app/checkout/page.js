import { CheckoutSummary } from "@/components/checkout-summary";
import { hasRazorpayConfig } from "@/lib/env";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Complete your digital template order.</h1>
        <p>Review your offer pricing, confirm how delivery works, and use Razorpay to complete a secure digital checkout.</p>
        {status === "cancelled" ? (
          <p className="status-note">Checkout was cancelled, but your cart is still available.</p>
        ) : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Before you pay</h3>
          <ul className="feature-list">
            <li>Prices shown here use the active offer pricing.</li>
            <li>Products are digital only and can include PDFs, spreadsheets, or full multi-file bundles.</li>
            <li>Your cart stays saved if you cancel checkout.</li>
            <li>Signed-in customers can access purchases again later from the account library.</li>
          </ul>
          <div className="checkout-assurance-grid">
            <div className="checkout-assurance-card">
              <strong>Secure payment</strong>
              <p>Razorpay handles the payment step and returns buyers to the success flow after confirmation.</p>
            </div>
            <div className="checkout-assurance-card">
              <strong>Instant delivery</strong>
              <p>Files are attached to the purchased product and become available in the account download library.</p>
            </div>
            <div className="checkout-assurance-card">
              <strong>Bundle-friendly</strong>
              <p>Bundle purchases unlock the full included file set, not just a placeholder download.</p>
            </div>
          </div>
          {!hasRazorpayConfig ? (
            <p className="status-note">
              Razorpay checkout is not configured in this app yet. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`,
              `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` to `.env.local`, then restart the dev server.
            </p>
          ) : null}
        </article>
        <CheckoutSummary hasRazorpayConfig={hasRazorpayConfig} />
      </div>
    </section>
  );
}
