import Link from "next/link";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { getCategoryDirectoryWithCounts } from "@/lib/catalog";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

export const metadata = {
  title: "Digital Product Categories",
  description:
    "Browse digital product categories including wedding templates, business documents, event planners, and printable productivity tools from The Digital Atlas.",
  alternates: {
    canonical: "/categories"
  },
  openGraph: {
    title: "Digital Product Categories | The Digital Atlas",
    description:
      "Browse digital product categories including wedding templates, business documents, event planners, and printable productivity tools from The Digital Atlas.",
    url: absoluteUrl("/categories")
  }
};

export default async function CategoriesPage() {
  const categories = await getCategoryDirectoryWithCounts();
  const liveCategories = categories.filter((category) => category.liveCount > 0);
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
      }
    ]
  };

  const categoryStats = [
    {
      label: "Live worlds",
      value: liveCategories.length
    },
    {
      label: "Subcategory lanes",
      value: liveCategories.reduce((total, category) => total + category.subcategories.length, 0)
    },
    {
      label: "Products live",
      value: liveCategories.reduce((total, category) => total + category.liveCount, 0)
    }
  ];

  return (
    <div className="storefront-page-shell">
      <section className="section-block storefront-category-directory-hero" data-reveal>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
        />
        <div className="storefront-category-hero-grid">
          <div className="page-intro storefront-category-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Category worlds</p>
            <h1>Browse the storefront by mood, use case, and product lane.</h1>
            <p>
              Instead of dropping shoppers into one giant catalog wall, these category routes create cleaner entry
              points for wedding, business, events, and planning.
            </p>
            <div className="catalog-chip-list storefront-chip-cluster">
              <Link className="catalog-chip" href="/shop">
                Open the shop
              </Link>
              <Link className="catalog-chip" href="/best-sellers">
                Browse best sellers
              </Link>
              <Link className="catalog-chip" href="/bundles">
                View bundle offers
              </Link>
            </div>
          </div>

          <div className="storefront-signal-grid storefront-signal-grid--compact" data-reveal>
            {categoryStats.map((stat) => (
              <article className="storefront-signal-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>Structured discovery routes that make the store easier to scan and easier to buy from.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block storefront-directory-shell" data-reveal>
        <div className="catalog-directory storefront-directory-grid">
          {liveCategories.map((category) => (
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
    </div>
  );
}
