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
          Your payment was received successfully. You can review your account or continue shopping below.
        </p>
      </div>

      <div className="split-panel">
        <article className="info-card">
          <h3>Your order</h3>
          <ul className="feature-list">
            <li>Your payment reference has been recorded.</li>
            <li>Your account will show completed purchases when available.</li>
            <li>You can continue browsing the catalog anytime.</li>
          </ul>
        </article>
        <article className="summary-card">
          <p className="eyebrow">Payment Reference</p>
          <h2>{paymentId || "Pending payment sync"}</h2>
          <p>{orderId ? `Order ${orderId} was created successfully.` : "Your order details will appear as soon as the payment sync is complete."}</p>
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
