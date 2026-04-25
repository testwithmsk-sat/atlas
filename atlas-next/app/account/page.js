import { AccountAuthPanel } from "@/components/account-auth-panel";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Account | The Digital Atlas"
};

export default async function AccountPage({ searchParams }) {
  const supabase = await createSupabaseServerClient();
  const sessionResult = supabase ? await supabase.auth.getUser() : null;
  const email = sessionResult?.data?.user?.email || "";
  const params = await searchParams;
  const checkoutState = params?.checkout || "";

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Account</p>
        <h1>Your account is still available, but the site is empty.</h1>
        <p>Sign in if you need account access, but no active listing or purchase flow is being shown.</p>
        {checkoutState === "success" ? (
          <p className="status-note">The site is currently empty, so new activity is not being displayed.</p>
        ) : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Current account status</h3>
          <p>The website is in an empty state, so browsing, history, and preview sections are hidden.</p>
          <ul className="feature-list">
            <li>No active listing flow is attached to the site.</li>
            <li>No current public-facing entries are shown here.</li>
            <li>Account access can remain available for future use.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
