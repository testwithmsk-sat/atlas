import Link from "next/link";

export const metadata = {
  title: "Checkout Success | The Digital Atlas"
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;
  const paymentId = params?.payment_id || "";
  const orderId = params?.order_id || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Order Confirmed</p>
        <h1>Thanks for your purchase.</h1>
        <p>
          Your Razorpay payment was verified successfully. The next step is syncing the order into your account history
          and download library.
        </p>
      </div>

      <div className="split-panel">
        <article className="info-card">
          <h3>What happens next</h3>
          <ul className="feature-list">
            <li>Your verified Razorpay payment records the order in Supabase.</li>
            <li>Your purchased products appear in the account download area.</li>
            <li>Order history can later trigger delivery emails automatically.</li>
          </ul>
        </article>
        <article className="summary-card">
          <p className="eyebrow">Payment Reference</p>
          <h2>{paymentId || "Pending payment sync"}</h2>
          <p>{orderId ? `Order ${orderId} was created successfully.` : "If your backend is fully configured, this purchase will show inside your account shortly."}</p>
          <div className="summary-actions">
            <Link className="button button-primary" href="/account">
              Go To Account
            </Link>
            <Link className="button button-secondary" href="/shop">
              Continue Shopping
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
