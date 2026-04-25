import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { getCategoryDirectoryWithCounts } from "@/lib/catalog";

export const metadata = {
  title: "Categories | The Digital Atlas",
  description: "Browse product categories on The Digital Atlas."
};

export default async function CategoriesPage() {
  const categories = await getCategoryDirectoryWithCounts();
  const liveCategories = categories.filter((category) => category.liveCount > 0);

  return (
    <section className="section-block">
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
