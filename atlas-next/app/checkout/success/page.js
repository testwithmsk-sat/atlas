import Link from "next/link";
import { listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getGenerationSession } from "@/lib/ai/sessions";

export const metadata = {
  title: "Checkout Success | The Digital Atlas"
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;
  const paymentId = params?.payment_id || "";
  const orderId = params?.order_id || "";
  const sessionId = params?.session_id || "";
  const session = sessionId ? await getGenerationSession(sessionId) : null;
  const bundleAssets = sessionId ? (await listGeneratedAssetsForSession(sessionId)).filter((asset) => asset.isPaid) : [];

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Order Confirmed</p>
        <h1>Thanks for your purchase.</h1>
        <p>
          Your generated full-bundle payment was received successfully. You can review your account or start a new AI workspace below.
        </p>
      </div>

      <div className="split-panel">
        <article className="info-card">
          <h3>Your order</h3>
          <ul className="feature-list">
            <li>Your payment reference has been recorded.</li>
            <li>Your account can be used for future workspace history and download access.</li>
            <li>You can start a new generation flow anytime and keep using the same account workspace.</li>
          </ul>
          {session ? <p className="status-note">{session.normalizedIntent.recommendedTitle}</p> : null}
        </article>
        <article className="summary-card">
          <p className="eyebrow">Payment Reference</p>
          <h2>{paymentId || "Pending payment sync"}</h2>
          <p>{orderId ? `Order ${orderId} was created successfully.` : "Your order details will appear as soon as the payment sync is complete."}</p>
          <div className="summary-actions">
            <Link className="button button-primary" href="/account">
              Go To Account
            </Link>
            {sessionId ? (
              <Link className="button button-secondary" href={`/workspace/${sessionId}`}>
                Reopen Workspace
              </Link>
            ) : (
              <Link className="button button-secondary" href="/">
                Start Another Plan
              </Link>
            )}
          </div>
        </article>
      </div>

      {bundleAssets.length ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Immediate downloads</p>
              <h2>Your generated bundle files are ready right now.</h2>
            </div>
          </div>
          <div className="account-list">
            {bundleAssets.map((asset) => (
              <div className="account-entry" key={asset.id}>
                <div>
                  <strong>{asset.fileName}</strong>
                  <p>{asset.format} full-bundle asset</p>
                </div>
                <div className="account-entry-actions">
                  <a className="text-link" href={`/api/assets/${asset.id}/download?orderId=${encodeURIComponent(orderId)}`}>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
