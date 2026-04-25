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
          <p className="eyebrow">Digital Template Catalog</p>
          <h1>Business, events, wedding, and home-planning templates in one storefront.</h1>
          <p className="hero-text">
            The storefront now combines editable spreadsheets, printable PDFs, invitations, planning kits, and bundle
            offers across multiple categories so customers can shop complete systems or affordable single files.
          </p>
          <div className="trust-strip">
            <span>{productCount} individual products</span>
            <span>{bundleCount} bundle offers</span>
            <span>Business + events + wedding + home</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Shop All Products
            </Link>
            <Link className="button button-secondary" href="/bundles">
              View Bundles
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
            <li>Business bundles with proposal, invoice, onboarding, and branding files.</li>
            <li>Event and celebration bundles with invitations, planners, and guest tools.</li>
            <li>Wedding and home-planning templates remain available alongside the new categories.</li>
            <li>Bundles stay easy to shop while individual files remain affordable add-ons.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Start with the strongest bundle and template offers.</h2>
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
          <h3>Customers can choose between single digital files, focused planning tools, and category-based bundles.</h3>
          <p>
            The catalog now supports business documents, event planners, home organization tools, and wedding
            printables from the same storefront.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Offer Strategy</p>
          <h3>Keep every bundle at $10 and use the single files as quick add-ons across each category.</h3>
          <p>
            The catalog now uses low, impulse-friendly pricing across the shop while still keeping bundle pricing easy
            to understand no matter which category a customer starts in.
          </p>
        </article>
      </section>
    </>
  );
}
