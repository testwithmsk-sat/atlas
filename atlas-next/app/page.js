import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, getBundleProducts, getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const [featuredProducts, bundleProducts, products] = await Promise.all([
    getFeaturedProducts(),
    getBundleProducts(),
    getAllProducts()
  ]);
  const bundle = bundleProducts[0] || null;
  const productCount = products.filter((product) => product.isBundle !== true).length;
  const bundleCount = bundleProducts.length;

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Wedding Collection</p>
          <h1>Wedding templates, planning spreadsheets, and printables in one storefront.</h1>
          <p className="hero-text">
            The storefront now combines editable planning spreadsheets, printable wedding PDFs, stationery, signage,
            and bundle offers so you can sell both low-ticket add-ons and budget-friendly wedding collections.
          </p>
          <div className="trust-strip">
            <span>{productCount} individual products</span>
            <span>{bundleCount} bundle offers</span>
            <span>Planning + stationery + signage</span>
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
            <strong>{bundle ? `${bundle.priceLabel} bundle price` : "$10.00 bundle price"}</strong>
            <span>
              {bundle
                ? `Regular price ${bundle.compareAtPriceLabel}. Customers get the full 11-file bundle in one purchase.`
                : "Bundle pricing is live for the full wedding collection."}
            </span>
          </div>
          <ul className="feature-list">
            <li>Invitation, RSVP, menu, sign, and thank you card products.</li>
            <li>Budget spreadsheets, vendor tools, checklists, and timeline planning.</li>
            <li>Offer pricing is shown across the storefront.</li>
            <li>Bundles support both premium planning and printable upsells.</li>
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
          <h3>Customers can choose between planning spreadsheets, printable PDFs, and bundled wedding resources.</h3>
          <p>
            The catalog now supports more than stationery alone, which gives you room to sell planning tools, day-of
            signage, and wedding printables from the same storefront.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Offer Strategy</p>
          <h3>Keep every bundle at $10 and use the individual files as affordable $1 to $5 add-ons.</h3>
          <p>
            The catalog now uses low, impulse-friendly pricing across the shop while still keeping bundle pricing easy
            to understand.
          </p>
        </article>
      </section>
    </>
  );
}
