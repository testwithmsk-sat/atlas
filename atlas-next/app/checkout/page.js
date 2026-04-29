import { CheckoutSummary } from "@/components/checkout-summary";
import { hasRazorpayConfig } from "@/lib/env";

export default async function CheckoutPage({ searchParams }) {
  const params = await searchParams;
  const status = params?.status || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Checkout</p>
        <h1>Unlock your generated full bundle.</h1>
        <p>Review your workspace bundle, confirm delivery, and use Razorpay to complete a secure digital checkout.</p>
        {status === "cancelled" ? (
          <p className="status-note">Checkout was cancelled, but your cart is still available.</p>
        ) : null}
      </div>

      <div className="checkout-grid">
        <article className="info-card">
          <h3>Before you pay</h3>
          <ul className="feature-list">
            <li>Prices shown here reflect the full bundle generated from your AI workspace session.</li>
            <li>Bundle outputs can include PDFs, PNG previews, editable DOCX files, or spreadsheets depending on the template family.</li>
            <li>Your cart stays saved if you cancel checkout.</li>
            <li>Signed-in customers can access unlocked bundles again later from the account workspace.</li>
          </ul>
          <div className="checkout-assurance-grid">
            <div className="checkout-assurance-card">
              <strong>Secure payment</strong>
              <p>Razorpay handles the payment step and returns buyers to the success flow after confirmation.</p>
            </div>
            <div className="checkout-assurance-card">
              <strong>Instant delivery</strong>
              <p>Files are attached to the purchased generation session and become available in the account workspace.</p>
            </div>
            <div className="checkout-assurance-card">
              <strong>Session-specific</strong>
              <p>Each bundle is tied to the exact AI workspace session that created it, not to a generic product page.</p>
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
