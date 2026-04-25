import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductPreviewMockup } from "@/components/product-preview-mockup";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product unavailable | The Digital Atlas"
    };
  }

  return {
    title: `${product.name} | The Digital Atlas`,
    description: product.summary
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const hasCompareAt = product.compareAtPriceLabel && product.compareAtPriceLabel !== product.priceLabel;
  const relatedProducts = await getRelatedProducts(product, 3);
  const allProducts = await getAllProducts();
  const bundleUpsell =
    !product.isBundle &&
    allProducts.find(
      (candidate) => candidate.isBundle === true && candidate.categorySlug === product.categorySlug && candidate.slug !== product.slug
    );
  const formatBadges = [
    product.details?.format,
    product.isBundle ? `${product.bundleContents.length || product.details?.includes?.length || 0} files` : null,
    product.category,
    product.status
  ].filter(Boolean);

  return (
    <>
      <section className="section-block">
        <div className="product-layout">
          <article className="product-visual-card">
            <ProductPreviewMockup product={product} className="product-mockup--hero" priority="hero" />
          </article>

          <article className="product-summary">
            <p className="eyebrow">{product.badge}</p>
            <h1>{product.name}</h1>
            <p className="product-card-kicker">
              {product.category} / {product.subcategory}
            </p>
            <p className="product-summary-text">{product.summary}</p>

            <div className="catalog-chip-list product-meta-chips">
              {formatBadges.map((badge) => (
                <span className="catalog-chip" key={badge}>
                  {badge}
                </span>
              ))}
            </div>

            <div className="price-row">
              <div className="price-stack">
                <strong>{product.priceLabel}</strong>
                {hasCompareAt ? <span className="price-original">{product.compareAtPriceLabel}</span> : null}
              </div>
              {hasCompareAt ? <span className="sale-pill">Offer price</span> : null}
            </div>

            <div className="hero-actions">
              <AddToCartButton product={product} />
              <Link className="button button-secondary" href="/shop">
                Back To Shop
              </Link>
            </div>

            {bundleUpsell ? (
              <div className="product-upsell-card">
                <p className="eyebrow">Frequently Bought Together</p>
                <h3>{bundleUpsell.name}</h3>
                <p>
                  Prefer a more complete set? This product also fits naturally inside the bundle, giving shoppers a
                  stronger all-in-one offer.
                </p>
                <div className="price-row compact-price-row">
                  <div className="price-stack">
                    <strong>{bundleUpsell.priceLabel}</strong>
                    {bundleUpsell.compareAtPriceLabel ? (
                      <span className="price-original">{bundleUpsell.compareAtPriceLabel}</span>
                    ) : null}
                  </div>
                  <Link className="text-link" href={`/products/${bundleUpsell.slug}`}>
                    View bundle
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="product-trust-panel">
              <div>
                <strong>Instant delivery</strong>
                <p>Files are unlocked in the customer account after successful checkout.</p>
              </div>
              <div>
                <strong>Secure checkout</strong>
                <p>Razorpay handles payment, and the cart stays saved if checkout is cancelled.</p>
              </div>
              <div>
                <strong>{product.isBundle ? "Bundle value" : "Single-file add-on"}</strong>
                <p>
                  {product.isBundle
                    ? "This bundle groups the full file set into one cleaner purchase."
                    : "This product works well as an affordable add-on beside bundles."}
                </p>
              </div>
            </div>

            <ul className="feature-list">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="mobile-sticky-buy">
              <div>
                <strong>{product.priceLabel}</strong>
                <span>{product.isBundle ? "Complete bundle" : "Instant digital file"}</span>
              </div>
              <AddToCartButton product={product} className="button button-primary product-sticky-button" />
            </div>
          </article>
        </div>

        <div className="product-details-grid">
          <article className="product-detail-card">
            <p className="eyebrow">Template Details</p>
            <dl className="product-spec-list">
              <div>
                <dt>Format</dt>
                <dd>{product.details.format}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{product.details.size}</dd>
              </div>
              <div>
                <dt>Pages</dt>
                <dd>{product.details.pages}</dd>
              </div>
              <div>
                <dt>Editing</dt>
                <dd>{product.details.editable}</dd>
              </div>
              <div>
                <dt>Printing</dt>
                <dd>{product.details.printable}</dd>
              </div>
            </dl>
          </article>

          <article className="product-detail-card">
            <p className="eyebrow">{product.isBundle ? "Bundle Contents" : "What You Get"}</p>
            <ul className="feature-list compact-detail-list">
              {(product.bundleContents.length > 0 ? product.bundleContents : product.details.includes).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="product-detail-card">
            <p className="eyebrow">After Purchase</p>
            <ul className="feature-list compact-detail-list">
              <li>Pay securely with Razorpay on the checkout page.</li>
              <li>Sign in to keep orders and download access connected to your account.</li>
              <li>Bundle purchases unlock each included source file individually in the download library.</li>
            </ul>
          </article>

          <article className="product-detail-card">
            <p className="eyebrow">Need Help?</p>
            <ul className="feature-list compact-detail-list">
              <li>Visit the FAQ page for download, compatibility, and delivery answers.</li>
              <li>Check the format, file count, and included items before purchase.</li>
              <li>Digital products are delivered instantly once payment is confirmed.</li>
            </ul>
            <Link className="text-link" href="/faq">
              Read the FAQ
            </Link>
          </article>

          <article className="product-detail-card">
            <p className="eyebrow">Good Match For</p>
            <ul className="feature-list compact-detail-list">
              <li>{product.category} shoppers who want ready-to-use digital files.</li>
              <li>{product.isBundle ? "Customers choosing a complete done-for-you pack." : "Customers adding a focused file to a larger order."}</li>
              <li>Buyers who want quick delivery with printable or editable formats.</li>
            </ul>
          </article>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Related Products</p>
              <h2>Keep shoppers moving within the same category.</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.slug} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
