import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, getBundleProducts, getCategoryDirectoryWithCounts, getFeaturedProducts } from "@/lib/catalog";
import { bundlePriceFloorLabel, storePriceRangeLabel } from "@/lib/seo";
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

const trustMoments = [
  {
    title: "Looks polished fast",
    copy: "Choose files that already feel premium, so customers spend less time fixing layout and more time using them."
  },
  {
    title: "Easy to customize",
    copy: "From fillable PDFs to spreadsheets and printable planners, the products are built to be used right away."
  },
  {
    title: "Instantly delivered",
    copy: "No waiting, no confusion. Checkout unlocks digital access quickly so buyers get value immediately."
  }
];

const testimonialMoments = [
  {
    quote: "Perfect for shoppers who want premium-looking templates without starting from scratch.",
    label: "Boutique look"
  },
  {
    quote: "Bundles make it easy to get everything in one purchase instead of piecing products together one by one.",
    label: "Better bundle value"
  },
  {
    quote: "The store feels organized, clear, and easy to trust, which makes buying much faster.",
    label: "Low-friction buying"
  }
];

const futuristicSignals = [
  { value: "24/7", label: "Instant digital access" },
  { value: "$1-$5", label: "Most single files" },
  { value: `${bundlePriceFloorLabel}+`, label: "Bundle deals start low" }
];

export const metadata = {
  title: `Affordable Digital Templates From ${storePriceRangeLabel}`,
  description: `Shop wedding templates, planners, checklists, business files, and digital downloads from ${storePriceRangeLabel}, with curated bundles from ${bundlePriceFloorLabel}.`,
  alternates: {
    canonical: "/"
  }
};

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
          <p className="eyebrow">Instant Digital Downloads</p>
          <h1>Professional templates, planners, and bundles that help buyers get results faster.</h1>
          <p className="hero-text">
            The Digital Atlas is built for customers who want polished digital products without paying premium-agency
            prices. Shop printable PDFs, editable files, spreadsheets, and curated bundles with most single products
            priced from {storePriceRangeLabel} and bundle offers starting from {bundlePriceFloorLabel}.
          </p>
          <div className="trust-strip">
            <span>{productCount} ready-to-use products</span>
            <span>{storePriceRangeLabel} most single files</span>
            <span>{bundlePriceFloorLabel}+ bundle offers</span>
          </div>
          <div className="hero-signal-row">
            <span>Looks premium from the start</span>
            <span>Low-cost digital products with real value</span>
            <span>Fast checkout and instant access</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Find Your Product
            </Link>
            <Link className="button button-secondary" href="/bundles">
              See Best-Value Bundles
            </Link>
          </div>
          <div className="hero-proof-grid">
            {trustMoments.map((moment) => (
              <div className="hero-proof-card" key={moment.title}>
                <strong>{moment.title}</strong>
                <span>{moment.copy}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Best Place To Start</p>
          <div className="hero-panel-stat hero-panel-stat--spotlight">
            <strong>{bundle ? bundle.name : "Signature bundle"}</strong>
            <span>
              {bundle
                ? `${bundle.priceLabel} instead of ${bundle.compareAtPriceLabel}. This is the easiest all-in-one purchase for shoppers who want the strongest value without piecing products together manually.`
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
            <span>Bundle savings</span>
            <span>Instant access</span>
          </div>
          <div className="hero-command-grid">
            {futuristicSignals.map((signal) => (
              <div className="hero-command-card" key={signal.label}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
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
            <p className="eyebrow">Why People Buy</p>
            <h2>Shoppers convert faster when the product already feels worth the price.</h2>
          </div>
        </div>
        <div className="catalog-directory">
          {testimonialMoments.map((item) => (
            <article className="catalog-card testimonial-card" key={item.label}>
              <p className="eyebrow">{item.label}</p>
              <h2>"{item.quote}"</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop By Category</p>
            <h2>Start with the exact category that matches what your customer needs right now.</h2>
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
            <p className="eyebrow">Featured Best Sellers</p>
            <h2>These are the easiest products to say yes to when buyers want fast value.</h2>
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
          <p className="eyebrow">Why This Store Works</p>
          <h2>Better product pages, better previews, and clearer offers make the purchase feel safer.</h2>
          <p>
            The best digital storefronts remove doubt. Customers should instantly understand what the file is, why it
            looks premium, how quickly they can use it, and why the bundle may be the smarter choice.
          </p>
          <div className="catalog-chip-list">
            <span className="catalog-chip">Premium presentation</span>
            <span className="catalog-chip">Clear value</span>
            <span className="catalog-chip">Confident checkout</span>
          </div>
        </article>
        <article className="info-card storefront-editorial-side">
          <p className="eyebrow">Conversion Focus</p>
          <h3>Lead with stronger bundle value while keeping single-file purchases easy and low risk.</h3>
          <p>
            When a shopper can immediately see the difference between a quick add-on and a full bundle, average order
            value rises and the store feels more intentionally merchandised.
          </p>
        </article>
      </section>

      <section className="section-block editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">How To Buy</p>
          <h3>Choose a single template for a quick win, or take a bundle for the biggest value per purchase.</h3>
          <p>
            The storefront now supports business documents, event planners, home organization tools, and wedding
            printables in one place, so shoppers can browse by need instead of hunting through mismatched marketplaces.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Best Value</p>
          <h3>Bundle pricing helps buyers feel like they are getting more for less, without second-guessing the cart.</h3>
          <p>
            Low-friction single products keep the store approachable, while premium bundles create a stronger reason to
            increase basket size in one purchase.
          </p>
        </article>
      </section>

      <section className="section-block trust-band">
        <article className="info-card">
          <p className="eyebrow">Why It Converts</p>
          <h3>Every page now works harder to reduce hesitation and move buyers toward checkout.</h3>
          <ul className="feature-list">
            <li>Category-led browsing helps people find the right use case without confusion.</li>
            <li>Clear bundle value makes bigger purchases feel smarter, not riskier.</li>
            <li>Instant digital delivery gives buyers confidence that they can use the file right away.</li>
          </ul>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">What Builds Trust</p>
          <h3>Strong previews, better copy, and simpler product decisions make the store feel more premium.</h3>
          <p>
            Customers buy faster when the product promise is obvious, the format is clear, and the storefront looks
            like it was designed by someone who understands digital merchandising.
          </p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Shop By Format</p>
            <h2>Some buyers search by use case. Others search by file type. Give both of them an easy entry point.</h2>
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
            <h2>Turn high-intent searches into direct paths to products that already match what people want.</h2>
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
          <h2>People recommend stores that feel polished, helpful, and worth coming back to.</h2>
          <p>
            Search traffic, repeat visits, and word-of-mouth all grow faster when the storefront feels established,
            the copy sounds confident, and the customer can quickly tell why the products are worth buying.
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
          <h3>Trust pages, keyword hubs, and stronger product storytelling all work together to grow visibility.</h3>
          <p>
            These improvements help Google understand the catalog faster, while helping real shoppers feel more certain
            about clicking, browsing, and purchasing.
          </p>
        </article>
      </section>
    </>
  );
}
