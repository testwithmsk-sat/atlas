import { AccountAuthPanel } from "@/components/account-auth-panel";
import { hasSupabaseConfig } from "@/lib/env";
import { formatInrAmount } from "@/lib/currency";
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
        <h1>Your account for orders and downloads.</h1>
        <p>Sign in to review your purchases, access available downloads, and manage your customer account.</p>
        {checkoutState === "success" ? (
          <p className="status-note">Checkout completed. Your order details will appear here after payment sync.</p>
        ) : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Why create an account</h3>
          <p>Keeping your purchases tied to one account makes downloads and order history easier to manage.</p>
          <ul className="feature-list">
            <li>Review past orders in one place.</li>
            <li>Access available download links faster.</li>
            <li>Use one email address consistently when you buy.</li>
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
                    <strong>{formatInrAmount(order.amount_total || 0)}</strong>
                    <p>{order.status}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-note">
              {email
                ? "No orders yet. Your completed purchases will appear here."
                : "Sign in to view your orders."}
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
                ? "Available downloads tied to your purchases will appear here."
                : "Sign in to unlock your download library."}
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
