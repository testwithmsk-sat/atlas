import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getBundleProducts, getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [featuredProducts, bundleProducts] = await Promise.all([getFeaturedProducts(), getBundleProducts()]);
  const bundle = bundleProducts[0] || null;

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Wedding Collection</p>
          <h1>Editable wedding templates your customers can type into instantly.</h1>
          <p className="hero-text">
            The storefront is now focused on one premium offer: 10 individual fillable PDF wedding templates plus a
            bundle deal with the customer guide included free.
          </p>
          <div className="trust-strip">
            <span>10 editable PDFs</span>
            <span>1 bundle offer</span>
            <span>Real fillable fields</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Shop Wedding Templates
            </Link>
            <Link className="button button-secondary" href="/bundles">
              View Bundle
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Bundle Offer</p>
          <div className="hero-panel-stat">
            <strong>{bundle ? `${bundle.priceLabel} offer price` : "$59.00 offer price"}</strong>
            <span>
              {bundle
                ? `Regular price ${bundle.compareAtPriceLabel}. Customers get the full 11-file bundle in one purchase.`
                : "Bundle pricing is live for the full wedding collection."}
            </span>
          </div>
          <ul className="feature-list">
            <li>Invitation, programme, RSVP, signs, and planner templates.</li>
            <li>Offer pricing is shown across the storefront.</li>
            <li>Bundle includes the customer instruction guide.</li>
            <li>Designed for Adobe Reader and PDF viewer editing.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Start with the strongest wedding sellers.</h2>
          </div>
          <Link className="text-link" href="/best-sellers">
            View all best sellers
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">How It Works</p>
          <h3>Customers open the PDF, click the fields, type their details, and save.</h3>
          <p>
            The collection is positioned as low-support digital stationery. The bundle product calls out the included
            guide so buyers know exactly how to edit their files.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Offer Strategy</p>
          <h3>Sell the full bundle at $59 and use the individual templates for easy upsells.</h3>
          <p>
            The individual listings are priced from $9 to $12, while the bundle shows the strongest savings against
            its regular price.
          </p>
        </article>
      </section>
    </>
  );
}
