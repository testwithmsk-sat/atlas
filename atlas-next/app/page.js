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

const toolkitLevels = [
  {
    title: "Starter energy",
    progress: 74,
    copy: "Single-file templates for quick wins, instant downloads, and low-friction entry points."
  },
  {
    title: "Creator combo",
    progress: 88,
    copy: "Category bundles and featured packs that feel like unlockable upgrades instead of plain add-ons."
  },
  {
    title: "Empire mode",
    progress: 96,
    copy: "High-clarity routing, premium motion, and better merchandising for stronger average order value."
  }
];

const rewardDrops = [
  {
    title: "Bundle vault",
    badge: "Unlockable",
    copy: "Position curated packs as collectible shortcuts that save time and increase perceived value.",
    tone: "violet"
  },
  {
    title: "XP badges",
    badge: "Live reward",
    copy: "Use progress language, streak-style visuals, and glowing chips to make browsing feel more playful.",
    tone: "pink"
  },
  {
    title: "Power-up paths",
    badge: "Fast route",
    copy: "Guide shoppers from single files into premium bundles with less hesitation and cleaner hierarchy.",
    tone: "blue"
  }
];

const empireSignals = ["Animated hero", "3D hover cards", "Gamified bundles", "Glowing CTA"];

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
  const heroStats = [
    {
      value: `${productCount}+`,
      label: "Premium products"
    },
    {
      value: `${liveCategories.length}+`,
      label: "Curated category worlds"
    },
    {
      value: `${bundleCount}+`,
      label: "Bundle power-ups"
    }
  ];

  return (
    <div className="neo-homepage">
      <section className="neo-hero" data-reveal>
        <div className="neo-hero-grid">
          <div className="neo-hero-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Curated digital atelier</p>
            <h1>
              DOWNLOAD.
              <span className="outline-word"> FEEL LIKE A</span>
              <span className="accent-word"> POWER-UP.</span>
            </h1>
            <p className="neo-hero-text">
              The Digital Atlas blends editable PDFs, printables, spreadsheets, and bundles into a playful premium
              storefront with glowing depth, bold type, and motion that makes every download feel more valuable before
              someone even hits add to cart.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary neo-hero-primary-button" href="/shop">
                Explore collections
              </Link>
              <Link className="button button-secondary" href="/bundles">
                View bundle drops
              </Link>
            </div>
            <div className="neo-stat-row neo-stat-row--hero">
              {heroStats.map((item) => (
                <article className="neo-stat-chip neo-stat-chip--hero" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="neo-hero-visual" data-reveal>
            <InteractiveHeroScene
              spotlight={bundle}
              featuredSingles={featuredSingles}
              productCount={productCount}
              bundleCount={bundleCount}
            />
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
          <Link className={`neo-command-card neo-command-card--${link.tone}`} key={link.href} href={link.href} data-reveal data-tilt>
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

      <section className="section-block neo-game-section" data-reveal>
        <div className="section-heading neo-section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">Level up your digital toolkit</p>
            <h2>Blend game energy with storefront clarity so shoppers feel momentum while they browse.</h2>
          </div>
        </div>
        <div className="neo-game-grid">
          <div className="neo-xp-column">
            {toolkitLevels.map((level) => (
              <article className="neo-xp-card" key={level.title} data-reveal style={{ "--xp-progress": `${level.progress}%` }}>
                <div className="neo-xp-topline">
                  <span>{level.title}</span>
                  <strong>{level.progress}%</strong>
                </div>
                <div className="neo-xp-bar">
                  <span className="neo-xp-fill"></span>
                </div>
                <p>{level.copy}</p>
              </article>
            ))}
          </div>
          <div className="neo-reward-grid">
            {rewardDrops.map((reward) => (
              <article className={`neo-reward-card neo-reward-card--${reward.tone}`} key={reward.title} data-reveal data-tilt>
                <p className="eyebrow">{reward.badge}</p>
                <h3>{reward.title}</h3>
                <p>{reward.copy}</p>
              </article>
            ))}
          </div>
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

      <section className="section-block neo-cta-section" data-reveal>
        <div className="neo-cta-copy">
          <p className="eyebrow eyebrow--electric">Conversion booster</p>
          <h2>START BUILDING YOUR DIGITAL EMPIRE TODAY</h2>
          <p>
            Keep the mood premium, the path obvious, and the bundles irresistible with a CTA that feels like the next
            step in the experience instead of the end of the page.
          </p>
          <div className="catalog-chip-list neo-cta-chip-row">
            {empireSignals.map((signal) => (
              <span className="catalog-chip" key={signal}>
                {signal}
              </span>
            ))}
          </div>
        </div>
        <div className="neo-cta-actions">
          <Link className="button button-primary neo-cta-button" href="/shop">
            Launch the catalog
          </Link>
          <Link className="button button-secondary" href="/account">
            Join the account hub
          </Link>
        </div>
      </section>
    </div>
  );
}
