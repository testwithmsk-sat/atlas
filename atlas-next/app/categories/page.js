import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { getCategoryDirectoryWithCounts } from "@/lib/catalog";

export const metadata = {
  title: "Categories | The Digital Atlas",
  description: "Browse every Digital Atlas category and open a focused category page."
};

export default async function CategoriesPage() {
  const categories = await getCategoryDirectoryWithCounts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Categories</p>
        <h1>Browse every collection before opening products.</h1>
        <p>
          Explore the full category directory and jump into dedicated shopping pages for the products you want.
        </p>
      </div>

      <section className="catalog-directory">
        {categories.map((category) => (
          <CatalogCategoryCard
            key={category.slug}
            category={category}
            href={`/shop/${category.slug}`}
            liveCount={category.liveCount}
            plannedCount={category.plannedCount}
          />
        ))}
      </section>
    </section>
  );
}
