import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { getCategoryDirectoryWithCounts } from "@/lib/catalog";

export const metadata = {
  title: "Shop | The Digital Atlas"
};

export default async function ShopPage() {
  const categories = await getCategoryDirectoryWithCounts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Catalog</p>
        <h1>Open a category page, then browse products inside that collection.</h1>
        <p>
          Start with the category directory and open the collection that matches what you want to buy.
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
