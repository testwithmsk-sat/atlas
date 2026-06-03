import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkspaceSessionClient } from "@/components/workspace-session-client";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  return {
    title: `Ideas ${sessionId}`,
    description: "Matched product ideas for your AI-generated request",
    robots: { index: false, follow: false }
  };
}

export default async function IdeaSessionPage({ params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) notFound();

  const assets = await listGeneratedAssetsForSession(sessionId);
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  const hasPaidAccess = email ? await customerHasPaidBundleAccess(sessionId, email) : false;
  const paidBundleOffer = getPaidBundleOffer(session.templateFamily);
  const sampleAssets = getSampleAssets(assets);
  const bundleAssets = hasPaidAccess ? getBundleAssets(assets) : [];
  const intent = session.normalizedIntent;

  return (
    <div className="stack">
      <section className="section-block intent-product-recommendation-shell">
        <div className="intent-product-recommendation-layout">
          <article className="intent-product-preview-card">
            <div className="product-preview-heading">
              <p className="eyebrow eyebrow--electric">AI-generated direction</p>
              <h2>{intent.recommendedTitle}</h2>
              <p>{intent.recommendedDescription}</p>
            </div>

            {/* AI-generated preview card instead of static PDF iframe */}
            <div className="intent-product-preview-mockup" style={{ padding: "2rem", background: "linear-gradient(135deg, #efe5cf 0%, #f7f3ea 52%, #d6e6df 100%)", borderRadius: "12px", minHeight: "260px" }}>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem", opacity: 0.6 }}>The Digital Atlas</p>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem" }}>{intent.recommendedTitle}</h3>
              <p style={{ fontSize: "0.95rem", marginBottom: "1.25rem", opacity: 0.8 }}>{intent.intentSummary || intent.recommendedDescription}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(intent.deliverables || []).slice(0, 4).map((item) => (
                  <span key={item} style={{ padding: "0.35rem 0.75rem", border: "1.5px solid rgba(23,33,47,0.18)", borderRadius: "999px", fontSize: "0.82rem", background: "rgba(255,255,255,0.5)" }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article className="intent-product-match-card">
            <p className="eyebrow">Your AI-generated bundle</p>
            <h2>{paidBundleOffer.bundleName}</h2>
            <p>{intent.recommendedDescription}</p>

            <div className="checkout-microcopy">
              {intent.useCaseType && <span>{intent.useCaseType}</span>}
              {intent.audienceProfile && <span>{intent.audienceProfile}</span>}
              {intent.styleDirection && <span>{intent.styleDirection}</span>}
            </div>

            <div className="summary-lines">
              <div>
                <span>Price</span>
                <strong>{paidBundleOffer.priceLabel}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{paidBundleOffer.bundleName}</strong>
              </div>
            </div>

            <ul className="feature-list compact-detail-list">
              {(intent.whyItFits || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="summary-actions">
              <Link className="button button-secondary" href={`/workspace/${sessionId}`}>
                Open planning workspace
              </Link>
            </div>
          </article>
        </div>
      </section>

      <WorkspaceSessionClient
        session={session}
        sampleAssets={sampleAssets}
        bundleAssets={bundleAssets}
        paidBundleOffer={paidBundleOffer}
        hasPaidAccess={hasPaidAccess}
        entryMode="ideas"
      />
    </div>
  );
}
