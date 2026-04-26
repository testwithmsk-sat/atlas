import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, getBundleProducts, getCategoryDirectoryWithCounts, getFeaturedProducts } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const formatDiscoveryLinks = [
  {
    href: "/shop?q=fillable",
    label: "Fillable templates",
    description: "Editable PDF products with typed fields and clean layouts.",
    tone: "rose"
  },
  {
    href: "/shop?q=pdf",
    label: "Printable PDF downloads",
    description: "Low-friction digital files for fast printing and sharing.",
    tone: "gold"
  },
  {
    href: "/shop?q=xlsx",
    label: "Spreadsheet planners",
    description: "Trackers, financial sheets, and digital planning workbooks.",
    tone: "sage"
  },
  {
    href: "/bundles",
    label: "Bundle offers",
    description: "High-value grouped product sets designed for easier buying.",
    tone: "sky"
  }
];

const popularSearchLinks = [
  { href: "/shop?q=wedding+template", label: "Wedding template ideas" },
  { href: "/shop?q=business+template", label: "Business document templates" },
  { href: "/shop?q=event+planner", label: "Event planner downloads" },
  { href: "/shop?q=printable+planner", label: "Printable planner products" },
  { href: "/shop?q=fillable+pdf", label: "Fillable PDF templates" },
  { href: "/shop?q=spreadsheet", label: "Spreadsheet tools" }
];

const motionKeywords = [
  "editable wedding invitation templates",
  "printable planner bundles",
  "business proposal templates",
  "event planning downloads",
  "fillable PDF products",
  "spreadsheet budget trackers"
];

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
  const featuredSingles = featuredProducts.filter((product) => product.isBundle !== true).slice(0, 3);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Curated Digital Storefront</p>
          <h1>Templates that feel polished before your customers even open the file.</h1>
          <p className="hero-text">
            The Digital Atlas combines premium-looking planners, editable spreadsheets, printable PDFs, and smart
            bundle offers so customers can shop by outcome instead of digging through scattered files.
          </p>
          <div className="trust-strip">
            <span>{productCount} individual products</span>
            <span>{bundleCount} bundle offers</span>
            <span>Instant digital delivery</span>
          </div>
          <div className="hero-signal-row">
            <span>Trending with planners</span>
            <span>Giftable digital products</span>
            <span>Fast checkout, instant access</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Shop All Products
            </Link>
            <Link className="button button-secondary" href="/bundles">
              View Bundles
            </Link>
          </div>
          <div className="hero-proof-grid">
            <div className="hero-proof-card">
              <strong>Professional by default</strong>
              <span>Refined templates for businesses, events, weddings, and home planning.</span>
            </div>
            <div className="hero-proof-card">
              <strong>Quick to buy, easy to use</strong>
              <span>Clear pricing, low-friction bundles, and instant access after checkout.</span>
            </div>
            <div className="hero-proof-card">
              <strong>Built to scale</strong>
              <span>Customers can browse by category, bundle, or individual use case.</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Store Highlights</p>
          <div className="hero-panel-stat hero-panel-stat--spotlight">
            <strong>{bundle ? bundle.name : "Signature bundle"}</strong>
            <span>
              {bundle
                ? `${bundle.priceLabel} now, compared with ${bundle.compareAtPriceLabel}. A polished all-in-one offer for customers who want the full set.`
                : "Bundle pricing is live with a cleaner premium anchor across the collection."}
            </span>
          </div>
          <div className="hero-spotlight-list">
            {featuredSingles.map((product) => (
              <Link className="hero-spotlight-item" key={product.slug} href={`/products/${product.slug}`}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.subcategory || product.category}</span>
                </div>
                <b>{product.priceLabel}</b>
              </Link>
            ))}
          </div>
          <div className="hero-microcopy">
            <span>Editable files</span>
            <span>Printable PDFs</span>
            <span>Planning kits</span>
          </div>
          <div className="hero-color-orbs" aria-hidden="true">
            <span className="hero-orb hero-orb--amber"></span>
            <span className="hero-orb hero-orb--rose"></span>
            <span className="hero-orb hero-orb--sky"></span>
          </div>
        </div>
      </section>

      <section className="trend-marquee" aria-label="Popular digital product searches">
        <div className="trend-marquee-track">
          {[...motionKeywords, ...motionKeywords].map((term, index) => (
            <span key={`${term}-${index}`}>{term}</span>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop By Category</p>
            <h2>Organize the store around what people are actually shopping for.</h2>
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
            <p className="eyebrow">Featured Collection</p>
            <h2>Lead with the strongest offers and the cleanest product presentation.</h2>
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

      <section className="section-block storefront-editorial">
        <article className="catalog-card storefront-editorial-main">
          <p className="eyebrow">Store Experience</p>
          <h2>A stronger storefront doesn&apos;t just look good. It makes buying feel easier.</h2>
          <p>
            Professional merchandising comes from clarity: fewer competing signals, better product hierarchy, and more
            confidence around what customers get after they purchase.
          </p>
          <div className="catalog-chip-list">
            <span className="catalog-chip">Confident pricing</span>
            <span className="catalog-chip">Premium previews</span>
            <span className="catalog-chip">Faster trust building</span>
          </div>
        </article>
        <article className="info-card storefront-editorial-side">
          <p className="eyebrow">Conversion Focus</p>
          <h3>Give bundles a premium role while keeping single products simple to understand.</h3>
          <p>
            The strongest stores make it obvious which products are quick wins, which are premium anchors, and why the
            customer should trust the purchase flow.
          </p>
        </article>
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

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop By Format</p>
            <h2>Help buyers discover the store through the file types they already search for.</h2>
          </div>
          <Link className="text-link" href="/guides">
            Read buying guides
          </Link>
        </div>
        <div className="catalog-directory homepage-format-grid">
          {formatDiscoveryLinks.map((link) => (
            <Link className={`catalog-card catalog-card--link format-card format-card--${link.tone}`} key={link.href} href={link.href}>
              <p className="eyebrow">Discovery</p>
              <h2>{link.label}</h2>
              <p>{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Popular Searches</p>
            <h2>Build clearer paths from search intent to the right products.</h2>
          </div>
        </div>
        <div className="catalog-chip-list popular-search-grid">
          {popularSearchLinks.map((link) => (
            <Link className="catalog-chip catalog-chip--large" key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block storefront-editorial">
        <article className="catalog-card storefront-editorial-main">
          <p className="eyebrow">Brand Trust</p>
          <h2>Popularity grows faster when the storefront feels established, useful, and easy to recommend.</h2>
          <p>
            Search traffic, repeat visits, and social sharing all improve when the store has clearer buying guides,
            stronger support pages, and a more obvious story around what makes the catalog useful.
          </p>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/about">
              About The Store
            </Link>
            <Link className="catalog-chip" href="/contact">
              Contact & Support
            </Link>
            <Link className="catalog-chip" href="/faq">
              Read The FAQ
            </Link>
            <Link className="catalog-chip" href="/guides">
              Explore Guides
            </Link>
          </div>
        </article>
        <article className="info-card storefront-editorial-side">
          <p className="eyebrow">Growth Layer</p>
          <h3>More internal links, stronger trust pages, and clearer keyword hubs make the store easier to find.</h3>
          <p>
            These improvements help both Google and real shoppers understand the products, the categories, and the
            store&apos;s purpose more quickly.
          </p>
        </article>
      </section>
    </>
  );
}
