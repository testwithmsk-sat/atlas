import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { InteractiveHeroScene } from "@/components/interactive-hero-scene";
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
    title: "Looks alive instantly",
    copy: "A playful first impression makes the catalog feel memorable before shoppers even start browsing."
  },
  {
    title: "Stays easy to scan",
    copy: "Strong contrast, uppercase hierarchy, and framed sections keep the motion from becoming visual noise."
  },
  {
    title: "Pushes action forward",
    copy: "Bundles, singles, categories, and support links are still merchandised in a straightforward buying path."
  }
];

const testimonialMoments = [
  {
    quote: "The store feels like a brand world instead of a flat catalog page, which makes every download feel more premium.",
    label: "Playful identity"
  },
  {
    quote: "Bundles read like power-ups now, so buyers instantly understand why the all-in purchase is the smarter move.",
    label: "Bundle gravity"
  },
  {
    quote: "Motion, contrast, and clearer hierarchy make the shopping journey easier to scan without losing the fun.",
    label: "Faster scanning"
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
    <div className="neo-homepage">
      <section className="neo-hero" data-reveal>
        <div className="neo-hero-grid">
          <div className="neo-hero-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Animated digital storefront</p>
            <h1>
              MAKE EVERY <span className="outline-word">DOWNLOAD</span> FEEL LIKE A
              <span className="accent-word"> POWER-UP.</span>
            </h1>
            <p className="neo-hero-text">
              The Digital Atlas now leans into playful motion, big contrast, and premium-but-fun energy. Browse
              editable PDFs, printables, spreadsheets, and bundles in a storefront that feels alive before shoppers
              even hit add to cart.
            </p>
            <div className="neo-stat-row">
              <div className="neo-stat-chip">
                <strong>{productCount}</strong>
                <span>single-file products live</span>
              </div>
              <div className="neo-stat-chip">
                <strong>{bundleCount}</strong>
                <span>bundle shortcuts to bigger carts</span>
              </div>
              <div className="neo-stat-chip">
                <strong>{bundlePriceFloorLabel}+</strong>
                <span>entry point for value-packed sets</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="/shop">
                Shop the catalog
              </Link>
              <Link className="button button-secondary" href="/bundles">
                Explore bundles
              </Link>
            </div>
            <div className="neo-hero-proof-grid">
              {trustMoments.map((moment) => (
                <article className="neo-mini-panel" key={moment.title} data-reveal>
                  <p>{moment.title}</p>
                  <span>{moment.copy}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="neo-hero-visual" data-reveal>
            <InteractiveHeroScene />
            <aside className="neo-hero-aside">
              <p className="eyebrow eyebrow--electric">Starter drop</p>
              <h2>{bundle ? bundle.name : "Signature bundle"}</h2>
              <p>
                {bundle
                  ? `${bundle.priceLabel} instead of ${bundle.compareAtPriceLabel}. Lead with the big value first, then let single-file products handle the quicker yeses.`
                  : "Bundle pricing stays front and center so the highest-value offer is visible immediately."}
              </p>
              <div className="neo-picked-list">
                {featuredSingles.map((product) => (
                  <Link className="neo-picked-item" key={product.slug} href={`/products/${product.slug}`}>
                    <span>{product.name}</span>
                    <b>{product.priceLabel}</b>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="trend-marquee neo-trend-marquee" aria-label="Popular digital product searches" data-reveal>
        <div className="trend-marquee-track">
          {[...motionKeywords, ...motionKeywords].map((term, index) => (
            <span key={`${term}-${index}`}>{term}</span>
          ))}
        </div>
      </section>

      <section className="neo-command-grid-shell" data-reveal>
        {formatDiscoveryLinks.map((link) => (
          <Link className={`neo-command-card neo-command-card--${link.tone}`} key={link.href} href={link.href} data-reveal>
            <span>Jump in</span>
            <strong>{link.label}</strong>
            <p>{link.description}</p>
          </Link>
        ))}
      </section>

      <section className="section-block neo-section" data-reveal>
        <div className="section-heading neo-section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">Why the redesign works</p>
            <h2>Motion grabs attention. Strong hierarchy makes that attention useful.</h2>
          </div>
        </div>
        <div className="neo-quote-grid">
          {testimonialMoments.map((item) => (
            <article className="catalog-card testimonial-card neo-quote-card" key={item.label} data-reveal>
              <p className="eyebrow">{item.label}</p>
              <h2>"{item.quote}"</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block neo-section" data-reveal>
        <div className="section-heading neo-section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">Shop by category</p>
            <h2>Drop people into the exact universe they need, not a generic wall of products.</h2>
          </div>
          <Link className="text-link" href="/categories">
            View all categories
          </Link>
        </div>
        <div className="catalog-directory category-spotlight-grid neo-category-grid">
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

      <section className="section-block neo-section" data-reveal>
        <div className="section-heading neo-section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">Featured best sellers</p>
            <h2>These products now sit inside a louder, bolder frame that makes their value easier to feel fast.</h2>
          </div>
          <Link className="text-link" href="/best-sellers">
            View all best sellers
          </Link>
        </div>
        <div className="product-grid neo-product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block neo-editorial-band" data-reveal>
        <article className="catalog-card storefront-editorial-main neo-editorial-main" data-reveal>
          <p className="eyebrow eyebrow--electric">Signal boost</p>
          <h2>Use playful spectacle up top, then let clarity and conversion do the rest of the work.</h2>
          <p>
            The homepage now acts like a stage set. Cursor glow, animated geometry, and the mascot create memorability,
            while the merchandised sections underneath keep the buying path obvious.
          </p>
          <div className="neo-signal-grid">
            {futuristicSignals.map((signal) => (
              <div className="neo-signal-card" key={signal.label}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="info-card storefront-editorial-side neo-editorial-side" data-reveal>
          <p className="eyebrow eyebrow--electric">Conversion focus</p>
          <h3>Lead with bolder bundles, then let quick-hit singles mop up the rest of the demand.</h3>
          <p>
            The redesign makes the store feel intentional, which means shoppers understand what they should buy first
            instead of spending energy decoding the page.
          </p>
          <div className="catalog-chip-list popular-search-grid neo-search-grid">
            {popularSearchLinks.map((link) => (
              <Link className="catalog-chip catalog-chip--large" key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="section-block neo-bottom-band" data-reveal>
        <article className="catalog-card storefront-editorial-main neo-bottom-card" data-reveal>
          <p className="eyebrow eyebrow--electric">Explore the orbit</p>
          <h2>Guide people from spectacle into certainty with sharper routes, support, and discovery pages.</h2>
          <p>The homepage sells the feeling. The support pages and category routes keep selling the trust.</p>
          <div className="catalog-chip-list">
            <Link className="catalog-chip" href="/about">
              About the store
            </Link>
            <Link className="catalog-chip" href="/contact">
              Contact & support
            </Link>
            <Link className="catalog-chip" href="/faq">
              Read the FAQ
            </Link>
            <Link className="catalog-chip" href="/guides">
              Explore guides
            </Link>
          </div>
        </article>
        <article className="info-card storefront-editorial-side neo-bottom-note" data-reveal>
          <p className="eyebrow eyebrow--electric">Growth layer</p>
          <h3>Keep the animated attitude on the homepage, but let the catalog stay practical and fast underneath.</h3>
          <p>
            That balance keeps the brand memorable without slowing down the routes that matter most when someone is
            ready to browse, compare, and buy.
          </p>
        </article>
      </section>
    </div>
  );
}
