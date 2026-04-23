import Link from "next/link";

export function CatalogCategoryCard({ category, href, liveCount = 0, plannedCount = 0 }) {
  const totalCount = liveCount + plannedCount;
  const hasProducts = totalCount > 0;

  return (
    <Link className="catalog-card catalog-card--link" href={href}>
      <p className="eyebrow">{category.navLabel}</p>
      <h2>{category.name}</h2>
      <p>{category.description}</p>
      <div className="catalog-chip-list">
        {category.subcategories.map((subcategory) => (
          <span className="catalog-chip" key={subcategory.slug}>
            {subcategory.name}
          </span>
        ))}
      </div>
      <p className="catalog-meta">
        {hasProducts
          ? `${liveCount} live ${liveCount === 1 ? "product" : "products"} • ${plannedCount} planned`
          : "No products planned yet"}
      </p>
    </Link>
  );
}
