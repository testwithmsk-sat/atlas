import Link from "next/link";
import { AccountAuthPanel } from "@/components/account-auth-panel";
import { getAllProducts } from "@/lib/catalog";
import { hasSupabaseConfig } from "@/lib/env";
import { getDownloadLibrary, getOrdersForCustomer } from "@/lib/orders";
import { supportsOnlineEditor } from "@/lib/pdf-editor";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Account | The Digital Atlas"
};

function formatOrderAmount(amount, currency) {
  const normalizedAmount = Number(amount || 0);
  const normalizedCurrency = String(currency || "INR").toUpperCase();

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2
    }).format(normalizedAmount);
  } catch {
    return `${normalizedCurrency} ${normalizedAmount.toFixed(2)}`;
  }
}

export default async function AccountPage({ searchParams }) {
  const supabase = await createSupabaseServerClient();
  const sessionResult = supabase ? await supabase.auth.getUser() : null;
  const email = sessionResult?.data?.user?.email || "";
  const params = await searchParams;
  const checkoutState = params?.checkout || "";
  const authState = params?.auth || "";
  const [orders, downloads, products] = email
    ? await Promise.all([getOrdersForCustomer(email), getDownloadLibrary(email), getAllProducts()])
    : [[], [], []];
  const productMap = new Map(products.map((product) => [product.slug, product]));

  let authMessage = "";
  if (authState === "unavailable") {
    authMessage = "Google sign-in is not available yet.";
  } else if (authState === "error" || authState === "google-error") {
    authMessage = "Google sign-in could not be started. Please try again.";
  } else if (authState) {
    authMessage = "Google sign-in was cancelled or needs more setup in Supabase.";
  }

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Account</p>
        <h1>Manage your account and future downloads.</h1>
        <p>Sign in to keep your order history connected and prepare this account for customer download access.</p>
        {checkoutState === "success" ? (
          <p className="status-note">Your order was completed successfully.</p>
        ) : null}
        {authMessage ? <p className="status-note">{authMessage}</p> : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Account readiness</h3>
          <p>This account area is ready for order history, download access, and returning purchases.</p>
          <ul className="feature-list">
            <li>Customers can sign in to manage purchases and access files again later.</li>
            <li>Bundle purchases now unlock the real source files attached to each product.</li>
            <li>Business, events, wedding, and planning files can all be delivered from the same library.</li>
          </ul>
        </article>
      </div>

      {email ? (
        <div className="account-data-grid">
          <article className="info-card">
            <p className="eyebrow">Download Library</p>
            <h3>{downloads.length ? `${downloads.length} file${downloads.length === 1 ? "" : "s"} ready` : "No downloads yet"}</h3>
            <p>
              {downloads.length
                ? "Your purchased files stay available here with signed download links."
                : "Complete a checkout while signed in and your purchased files will appear here."}
            </p>
            {downloads.length ? (
              <div className="account-list">
                {downloads.map((download) => (
                  <div className="account-entry" key={`${download.orderId}-${download.productSlug}-${download.fileName}`}>
                    <div>
                      <strong>{download.productName}</strong>
                      <p>{download.fileName}</p>
                      <p>{download.purchasedAt ? `Granted ${new Date(download.purchasedAt).toLocaleDateString("en-IN")}` : "Ready to download"}</p>
                    </div>
                    <div className="account-entry-actions">
                      {supportsOnlineEditor(productMap.get(download.productSlug)) ? (
                        <Link className="text-link" href={`/editor/${download.productSlug}`}>
                          Edit online
                        </Link>
                      ) : null}
                      <a className="text-link" href={download.fileUrl} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          <article className="info-card">
            <p className="eyebrow">Order History</p>
            <h3>{orders.length ? `${orders.length} order${orders.length === 1 ? "" : "s"} found` : "No orders yet"}</h3>
            <p>
              {orders.length
                ? "Your completed and pending checkout records appear here."
                : "Once you place an order, its payment status and amount will show in this account."}
            </p>
            {orders.length ? (
              <div className="account-list">
                {orders.map((order) => (
                  <div className="account-entry" key={order.id}>
                    <div>
                      <strong>{formatOrderAmount(order.amount_total, order.currency)}</strong>
                      <p>{order.payment_status || order.status || "pending"}</p>
                      <p>{order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "Recent order"}</p>
                    </div>
                    <span className="eyebrow">{order.order_items?.length || 0} items</span>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      ) : null}
    </section>
  );
}
