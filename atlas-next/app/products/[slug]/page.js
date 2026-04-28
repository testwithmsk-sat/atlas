import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductPreviewMockup } from "@/components/product-preview-mockup";
import { getAllProducts, getProductBySlug, getRelatedProducts, parsePriceLabel } from "@/lib/catalog";
import { getProductPreviewSources } from "@/lib/product-preview-sources";
import { supportsOnlineEditor } from "@/lib/pdf-editor";
import { absoluteUrl, bundlePriceFloorLabel, storePriceRangeLabel, toJsonLd } from "@/lib/seo";

function normalizeBundleLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/^\d+\s*/g, "")
    .replace(/\bvol\.?\s*\d+\b/g, "")
    .replace(/\bpdf\b/g, "")
    .replace(/&/g, "and")
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bundleLabelMatchesProduct(label, includedProduct) {
  const normalizedLabel = normalizeBundleLabel(label);
  const normalizedProductName = normalizeBundleLabel(includedProduct?.name);

  return (
    normalizedLabel === normalizedProductName ||
    normalizedLabel.includes(normalizedProductName) ||
    normalizedProductName.includes(normalizedLabel)
  );
}

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

  const formatLabel = product.details?.format || product.productType;
  const seoDescription = `${product.summary} Only ${product.priceLabel} from The Digital Atlas. Shop this ${product.category.toLowerCase()} digital download in ${formatLabel.toLowerCase()} format, with most single files across the store priced from ${storePriceRangeLabel} and bundles from ${bundlePriceFloorLabel}.`;

  return {
    title: `${product.name} ${formatLabel ? `| ${formatLabel}` : ""}`,
    description: seoDescription,
    keywords: [
      product.name.toLowerCase(),
      `${product.priceLabel} digital download`,
      `${product.category.toLowerCase()} digital download`,
      `${product.subcategory.toLowerCase()} template`,
      `${formatLabel.toLowerCase()} template`,
      product.productType.toLowerCase()
    ],
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      title: `${product.name} | The Digital Atlas`,
      description: seoDescription,
      url: absoluteUrl(`/products/${product.slug}`),
      images: [
        {
          url: absoluteUrl(product.image),
          alt: product.name
        }
      ]
    }
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const hasCompareAt = product.compareAtPriceLabel && product.compareAtPriceLabel !== product.priceLabel;
  const relatedProducts = await getRelatedProducts(product, 3);
  const allProducts = await getAllProducts();
  const productMap = new Map(allProducts.map((candidate) => [candidate.slug, candidate]));
  const parentBundles = (product.parentBundleSlugs || []).map((bundleSlug) => productMap.get(bundleSlug)).filter(Boolean);
  const includedProducts = (product.includedProductSlugs || []).map((includedSlug) => productMap.get(includedSlug)).filter(Boolean);
  const extraBundleContentLabels = (product.bundleContents || []).filter(
    (item) => !includedProducts.some((includedProduct) => bundleLabelMatchesProduct(item, includedProduct))
  );
  const numericPrice = parsePriceLabel(product.priceLabel);
  const hasOnlineEditor = supportsOnlineEditor(product);
  const previewFiles = getProductPreviewSources(product.slug);
  const hasDocumentPreview = previewFiles.length > 0;
  const heroPreview = previewFiles[0] || null;
  const missingPreviewCount = Math.max(0, product.bundleContents.length - previewFiles.length);
  const formatBadges = [
    product.details?.format,
    product.isBundle ? `${product.bundleContents.length || product.details?.includes?.length || 0} files` : null,
    product.category,
    product.status
  ].filter(Boolean);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: absoluteUrl("/categories")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: absoluteUrl(`/shop/${product.categorySlug}`)
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: absoluteUrl(`/products/${product.slug}`)
      }
    ]
  };
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: [absoluteUrl(product.image)],
    category: `${product.category} > ${product.subcategory}`,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "The Digital Atlas"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: numericPrice.toFixed(2),
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.slug}`),
      itemCondition: "https://schema.org/NewCondition"
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Format",
        value: product.details?.format || product.productType
      },
      {
        "@type": "PropertyValue",
        name: "Delivery",
        value: product.status
      }
    ]
  };

  return (
    <>
      <section className="section-block product-page-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(productJsonLd) }}
        />
        <div className="product-layout">
          <article className="product-visual-card">
            {hasDocumentPreview && heroPreview ? (
              <div className="product-preview-panel">
                <div className="product-preview-heading">
                  <p className="eyebrow">{previewFiles.length > 1 ? "Bundle PDF Preview" : "Full PDF Preview"}</p>
                  <h3>{previewFiles.length > 1 ? "Browse the actual files included in this product." : "Browse the actual PDF right on the product page."}</h3>
                  <p>
                    Scroll inside the embedded preview to see the full document pages before checkout.
                  </p>
                </div>
                <div className="product-preview-frame-shell product-preview-frame-shell--hero">
                  <iframe
                    className="product-preview-frame"
                    src={`${heroPreview.src}#view=FitH`}
                    title={`Preview of ${heroPreview.label}`}
                    loading="eager"
                  />
                </div>
                <div className="catalog-chip-list product-preview-chip-list">
                  {previewFiles.slice(0, 6).map((preview) => (
                    <span className="catalog-chip" key={preview.id}>
                      {preview.label}
                    </span>
                  ))}
                  {previewFiles.length > 6 ? (
                    <span className="catalog-chip">+{previewFiles.length - 6} more PDF previews</span>
                  ) : null}
                </div>
                {missingPreviewCount > 0 ? (
                  <p className="product-preview-note">
                    {missingPreviewCount} included file{missingPreviewCount === 1 ? "" : "s"} do not render inline here
                    because they are delivered in a different format.
                  </p>
                ) : null}
              </div>
            ) : (
              <ProductPreviewMockup product={product} className="product-mockup--hero" priority="hero" />
            )}
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
              {hasOnlineEditor ? (
                <Link className="button button-secondary" href={`/editor/${product.slug}`}>
                  Edit Online
                </Link>
              ) : null}
              <Link className="button button-secondary" href="/shop">
                Back To Shop
              </Link>
            </div>

            {parentBundles.length > 0 ? (
              <div className="product-upsell-card">
                <p className="eyebrow">{parentBundles.length === 1 ? "Included In This Bundle" : "Included In These Bundles"}</p>
                <h3>{parentBundles.length === 1 ? parentBundles[0].name : "This single file is organized inside multiple bundle offers."}</h3>
                <p>
                  This file is sold separately, but it also belongs to the exact bundle collection listed below. That
                  keeps the single-file listing and the bundle structure aligned instead of mixing unrelated products.
                </p>
                <div className="account-list">
                  {parentBundles.map((bundle) => (
                    <div className="account-entry" key={bundle.slug}>
                      <div>
                        <strong>{bundle.name}</strong>
                        <p>{bundle.summary}</p>
                      </div>
                      <div className="account-entry-actions">
                        <span className="eyebrow">{bundle.priceLabel}</span>
                        <Link className="text-link" href={`/products/${bundle.slug}`}>
                          View bundle
                        </Link>
                      </div>
                    </div>
                  ))}
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
              {hasOnlineEditor ? (
                <div>
                  <strong>Online editor</strong>
                  <p>Customers can personalize this PDF in the browser and unlock export after purchase.</p>
                </div>
              ) : null}
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

        {previewFiles.length > 1 ? (
          <article className="product-detail-card product-detail-card--wide product-preview-gallery-card">
            <p className="eyebrow">See Inside The Bundle</p>
            <h3>Customers can browse each included PDF directly on the website.</h3>
            <p>
              Each preview below opens the real document inline so shoppers can see what is inside the bundle before
              adding it to cart.
            </p>
            <div className="product-preview-gallery">
              {previewFiles.map((preview) => (
                <div className="product-preview-gallery-item" key={preview.id}>
                  <div className="product-preview-gallery-copy">
                    <strong>{preview.label}</strong>
                    <span>Full PDF preview</span>
                  </div>
                  <div className="product-preview-frame-shell">
                    <iframe
                      className="product-preview-frame"
                      src={`${preview.src}#view=FitH`}
                      title={`Preview of ${preview.label}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ) : null}

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
              {product.isBundle && includedProducts.length > 0
                ? includedProducts.map((includedProduct) => (
                    <li key={includedProduct.slug}>
                      <Link className="text-link" href={`/products/${includedProduct.slug}`}>
                        {includedProduct.name}
                      </Link>
                    </li>
                  ))
                : null}
              {product.isBundle && extraBundleContentLabels.length > 0
                ? extraBundleContentLabels.map((item) => <li key={item}>{item}</li>)
                : null}
              {!product.isBundle
                ? product.details.includes.map((item) => <li key={item}>{item}</li>)
                : null}
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
