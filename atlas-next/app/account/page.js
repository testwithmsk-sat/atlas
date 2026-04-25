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
        <h1>Manage your account and future downloads.</h1>
        <p>Sign in to keep your order history connected and prepare this account for customer download access.</p>
        {checkoutState === "success" ? (
          <p className="status-note">Your order was completed successfully.</p>
        ) : null}
      </div>

      <div className="split-panel">
        <AccountAuthPanel email={email} hasSupabase={hasSupabaseConfig} />
        <article className="info-card">
          <h3>Account readiness</h3>
          <p>This account area is ready for order history, download access, and future customer library features.</p>
          <ul className="feature-list">
            <li>Customers can sign in to manage future purchases.</li>
            <li>Download access can be connected through the existing Supabase workflow.</li>
            <li>The storefront now points buyers into live wedding products and bundle offers.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
