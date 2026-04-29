import Link from "next/link";
import { AccountAuthPanel } from "@/components/account-auth-panel";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { listGenerationOrdersForCustomer } from "@/lib/ai/orders";
import { listGenerationSessionsForCustomer } from "@/lib/ai/sessions";
import { hasSupabaseConfig } from "@/lib/env";
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
  const [sessions, orders] = email
    ? await Promise.all([listGenerationSessionsForCustomer(email), listGenerationOrdersForCustomer(email)])
    : [[], []];
  const assetsBySession = new Map();

  if (sessions.length) {
    const assetsList = await Promise.all(sessions.map((session) => listGeneratedAssetsForSession(session.sessionId)));
    sessions.forEach((session, index) => {
      assetsBySession.set(session.sessionId, assetsList[index]);
    });
  }

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
        <h1>Manage your AI workspaces, samples, and unlocked bundles.</h1>
        <p>Sign in to save generation sessions, revisit free samples, and access the full bundles you have unlocked.</p>
        {checkoutState === "success" ? <p className="status-note">Your generated bundle order was completed successfully.</p> : null}
        {authMessage ? <p className="status-note">{authMessage}</p> : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Account continuity</h3>
          <p>This account area keeps the new intent-first workflow coherent over time.</p>
          <ul className="feature-list">
            <li>Signed-in users can revisit old generation sessions instead of starting from scratch.</li>
            <li>Free sample assets stay attached to their saved workspace history.</li>
            <li>Paid bundle downloads can be reopened from this one account hub.</li>
          </ul>
        </article>
      </div>

      {email ? (
        <div className="stack">
          <article className="info-card">
            <p className="eyebrow">Saved Workspaces</p>
            <h3>{sessions.length ? `${sessions.length} workspace${sessions.length === 1 ? "" : "s"} saved` : "No saved workspaces yet"}</h3>
            <p>
              {sessions.length
                ? "Every signed-in generation session is collected here with its free sample and bundle status."
                : "Start a generation session while signed in and it will appear here automatically."}
            </p>
            {sessions.length ? (
              <div className="account-list">
                {sessions.map((workspace) => {
                  const sessionAssets = assetsBySession.get(workspace.sessionId) || [];
                  const sampleAssets = getSampleAssets(sessionAssets);

                  return (
                    <div className="account-entry" key={workspace.sessionId}>
                      <div>
                        <strong>{workspace.normalizedIntent.recommendedTitle}</strong>
                        <p>{workspace.normalizedIntent.useCaseType}</p>
                        <p>{workspace.normalizedIntent.intentSummary}</p>
                      </div>
                      <div className="account-entry-actions">
                        <Link className="text-link" href={`/workspace/${workspace.sessionId}`}>
                          Open workspace
                        </Link>
                        {sampleAssets[0] ? (
                          <a className="text-link" href={`/api/assets/${sampleAssets[0].id}/download`}>
                            Download sample
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </article>

          <article className="info-card">
            <p className="eyebrow">Unlocked Bundles</p>
            <h3>{orders.length ? `${orders.length} paid bundle${orders.length === 1 ? "" : "s"}` : "No paid bundles yet"}</h3>
            <p>
              {orders.length
                ? "These are the generation sessions you have unlocked through checkout."
                : "When you unlock a full generated bundle, it will show up here with its workspace and download links."}
            </p>
            {orders.length ? (
              <div className="account-list">
                {orders.map((order) => {
                  const sessionAssets = assetsBySession.get(order.sessionId) || [];
                  const paidAssets = getBundleAssets(sessionAssets);

                  return (
                    <div className="account-entry" key={order.gatewayOrderId}>
                      <div>
                        <strong>{formatOrderAmount(order.amountTotal, order.currency)}</strong>
                        <p>{order.status}</p>
                        <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "Recent order"}</p>
                      </div>
                      <div className="account-entry-actions">
                        <Link className="text-link" href={`/workspace/${order.sessionId}`}>
                          Open workspace
                        </Link>
                        {paidAssets[0] ? (
                          <a className="text-link" href={`/api/assets/${paidAssets[0].id}/download`}>
                            Download files
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </article>
        </div>
      ) : null}
    </section>
  );
}
