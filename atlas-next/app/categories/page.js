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

  return (
    <section className="section-block">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <div className="page-intro">
        <p className="eyebrow">Categories</p>
        <h1>Browse the live storefront by category.</h1>
        <p>Use the live categories to jump straight into business, events, wedding, and planning products.</p>
      </div>
      <div className="catalog-directory">
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
  );
}
