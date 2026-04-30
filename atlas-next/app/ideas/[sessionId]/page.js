import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductPreviewMockup } from "@/components/product-preview-mockup";
import { WorkspaceSessionClient } from "@/components/workspace-session-client";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { getRecommendedProductsForIntent } from "@/lib/catalog";
import { getProductPreviewSources } from "@/lib/product-preview-sources";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;

  return {
    title: `Ideas ${sessionId}`,
    description: "Matched product ideas for your AI-generated request",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function IdeaSessionPage({ params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    notFound();
  }

  const assets = await listGeneratedAssetsForSession(sessionId);
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  const hasPaidAccess = email ? await customerHasPaidBundleAccess(sessionId, email) : false;
  const matchedProducts = await getRecommendedProductsForIntent(session, 3);
  const primaryProduct = matchedProducts[0] || null;
  const primaryPreview = primaryProduct ? getProductPreviewSources(primaryProduct.slug)[0] || null : null;

  return (
    <div className="stack">
      <section className="section-block intent-product-recommendation-shell">
        <div className="intent-product-recommendation-layout">
          <article className="intent-product-preview-card">
            <div className="product-preview-heading">
              <p className="eyebrow eyebrow--electric">Best matched product</p>
              <h2>{primaryProduct ? primaryProduct.name : session.normalizedIntent.recommendedTitle}</h2>
              <p>
                Show the customer the actual product before asking for trust. This match leads with the product page,
                price, and preview so the buying path feels concrete.
              </p>
            </div>
            {primaryProduct ? (
              primaryPreview ? (
                <div className="product-preview-frame-shell">
                  <iframe
                    className="product-preview-frame"
                    src={`${primaryPreview.src}#view=FitH`}
                    title={`Preview of ${primaryProduct.name}`}
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="intent-product-preview-mockup">
                  <ProductPreviewMockup product={primaryProduct} className="product-mockup--hero" priority="hero" />
                </div>
              )
            ) : null}
          </article>

          <article className="intent-product-match-card">
            <p className="eyebrow">Why this is the best first buy</p>
            <h2>{primaryProduct ? primaryProduct.name : paidBundleOffer.bundleName}</h2>
            <p>{primaryProduct ? primaryProduct.summary : session.normalizedIntent.recommendedDescription}</p>

            <div className="checkout-microcopy">
              <span>{session.normalizedIntent.useCaseType}</span>
              <span>{session.normalizedIntent.audienceProfile}</span>
              <span>{session.normalizedIntent.styleDirection}</span>
            </div>

            <div className="summary-lines">
              <div>
                <span>Price</span>
                <strong>{primaryProduct ? primaryProduct.priceLabel : paidBundleOffer.priceLabel}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{primaryProduct ? primaryProduct.productType : paidBundleOffer.bundleName}</strong>
              </div>
            </div>

            <div className="summary-actions">
              {primaryProduct ? (
                <>
                  <Link className="button button-primary" href={`/products/${primaryProduct.slug}`}>
                    View product
                  </Link>
                  <AddToCartButton product={primaryProduct} className="button button-secondary" />
                </>
              ) : null}
            </div>

            <ul className="feature-list compact-detail-list">
              {session.normalizedIntent.whyItFits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p className="intent-product-match-note">
              If you want the AI breakdown, sample generation logic, and bundle-specific session details, the planning
              workspace is still available as the next step.
            </p>

            <div className="summary-actions">
              <Link className="button button-secondary" href={`/workspace/${sessionId}`}>
                Open planning workspace
              </Link>
            </div>
          </article>
        </div>
      </section>

      {matchedProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Matched products</p>
              <h2>See the products that fit this request before you decide.</h2>
            </div>
          </div>
          <div className="product-grid">
            {matchedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <WorkspaceSessionClient
        session={session}
        sampleAssets={getSampleAssets(assets)}
        bundleAssets={hasPaidAccess ? getBundleAssets(assets) : []}
        paidBundleOffer={getPaidBundleOffer(session.templateFamily)}
        hasPaidAccess={hasPaidAccess}
        entryMode="ideas"
      />
    </div>
  );
}
