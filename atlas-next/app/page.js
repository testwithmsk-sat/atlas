import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, getBundleProducts, getCategoryDirectoryWithCounts, getFeaturedProducts } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const code = params?.code;
  const error = params?.error;
  const errorDescription = params?.error_description;
  const next = params?.next || "/account";

  if (error) {
    const authMessage = encodeURIComponent(errorDescription || "google-error");
    redirect(`${next}?auth=${authMessage}`);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      redirect(`${next}?auth=unavailable`);
    }

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      const authMessage = encodeURIComponent(exchangeError.message || "google-error");
      redirect(`${next}?auth=${authMessage}`);
    }

    const callbackParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params || {})) {
      if (key !== "code" && typeof value === "string" && value) {
        callbackParams.set(key, value);
      }
    }

    if (callbackParams.toString()) {
      redirect(`${next}?${callbackParams.toString()}`);
    }

    redirect(next);
  }

  const [featuredProducts, bundleProducts, products, categories] = await Promise.all([
    getFeaturedProducts(),
    getBundleProducts(),
    getAllProducts(),
    getCategoryDirectoryWithCounts()
  ]);
  const bundle = bundleProducts[0] || null;
  const productCount = products.filter((product) => product.isBundle !== true).length;
  const bundleCount = bundleProducts.length;
  const liveCategories = categories.filter((category) => category.liveCount > 0);
  const categorySpotlights = liveCategories.slice(0, 4);

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
            <p className="eyebrow">Shop By Category</p>
            <h2>Let customers start where their intent already is.</h2>
          </div>
          <Link className="text-link" href="/categories">
            View all categories
          </Link>
        </div>
        <div className="catalog-directory category-spotlight-grid">
          {categorySpotlights.map((category) => (
            <CatalogCategoryCard
              key={category.slug}
              category={category}
              href={`/shop/${category.slug}`}
              liveCount={category.liveCount}
              plannedCount={category.plannedCount}
            />
          ))}
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

      <section className="section-block trust-band">
        <article className="info-card">
          <p className="eyebrow">Why It Converts</p>
          <h3>Every category now has a clearer path from browse to bundle to checkout.</h3>
          <ul className="feature-list">
            <li>Category-led browsing helps buyers find the right use case faster.</li>
            <li>Bundles act as premium anchors while single files stay easy add-ons.</li>
            <li>Instant digital delivery and saved carts reduce checkout hesitation.</li>
          </ul>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Best Next Step</p>
          <h3>Keep evolving the strongest categories with more previews, reviews, and product education.</h3>
          <p>
            The storefront is now structured well enough to scale. The next gains will come from stronger product
            storytelling and trust-building details on individual listings.
          </p>
        </article>
      </section>
    </>
  );
}
