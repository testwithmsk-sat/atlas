import { AccountAuthPanel } from "@/components/account-auth-panel";
import { hasSupabaseConfig } from "@/lib/env";
import { getDownloadLibrary, getOrdersForCustomer } from "@/lib/orders";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Account | The Digital Atlas"
};

export default async function AccountPage({ searchParams }) {
  const supabase = await createSupabaseServerClient();
  const sessionResult = supabase ? await supabase.auth.getUser() : null;
  const email = sessionResult?.data?.user?.email || "";
  const params = await searchParams;
  const orders = await getOrdersForCustomer(email);
  const downloads = await getDownloadLibrary(email);
  const checkoutState = params?.checkout || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Account</p>
        <h1>Customer accounts now have a real auth starter.</h1>
        <p>
          This page is now wired for Supabase-ready sign in and sign up, while still staying safe to run before live
          credentials are added.
        </p>
        {checkoutState === "success" ? (
          <p className="status-note">Checkout completed. Your order history will appear here after sync.</p>
        ) : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Recommended backend</h3>
          <p>Supabase Auth plus product and order tables is still the cleanest next move for this site.</p>
          <ul className="feature-list">
            <li>Sign in and account creation are now wired for Supabase.</li>
            <li>Orders and downloads can attach to the authenticated customer next.</li>
            <li>Use <code>.env.example</code> and <code>supabase-schema.sql</code> to continue setup.</li>
          </ul>
        </article>
      </div>

      <div className="split-panel account-data-grid">
        <article className="info-card">
          <p className="eyebrow">Orders</p>
          <h3>Order history</h3>
          {email && orders.length > 0 ? (
            <div className="account-list">
              {orders.map((order) => (
                <article className="account-entry" key={order.id}>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "Recent order"}</p>
                  </div>
                  <div>
                    <strong>${Number(order.amount_total || 0).toFixed(2)}</strong>
                    <p>{order.status}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-note">
              {email
                ? "No orders yet. Once Stripe webhook sync is active, purchases will show here."
                : "Sign in to view future orders."}
            </p>
          )}
        </article>

        <article className="info-card">
          <p className="eyebrow">Downloads</p>
          <h3>Purchased library</h3>
          {email && downloads.length > 0 ? (
            <div className="account-list">
              {downloads.map((item) => (
                <article className="account-entry" key={`${item.orderId}-${item.productSlug}-${item.productName}`}>
                  <div>
                    <strong>{item.productName}</strong>
                    <p>{item.fileName || item.productSlug || "Digital product"}</p>
                  </div>
                  <div>
                    {item.fileUrl ? (
                      <a className="button button-secondary" href={item.fileUrl} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    ) : (
                      <strong>{item.status}</strong>
                    )}
                    <p>{item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString() : "Order synced"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-note">
              {email
                ? "Your paid orders will create private signed download links here automatically."
                : "Sign in to unlock your future download library."}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
