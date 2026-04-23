import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCategoryPageData } from "@/lib/catalog";
import { categoryDirectory } from "@/lib/catalog-taxonomy";

export async function generateStaticParams() {
  return categoryDirectory.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) {
    return { title: "Category not found | The Digital Atlas" };
  }

  return {
    title: `${categoryPage.category.name} | The Digital Atlas`,
    description: categoryPage.category.description
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) notFound();

  const { category, groups, liveCount, plannedCount } = categoryPage;

  return (
    <section className="section-block">
      <div className="page-intro category-page-intro">
        <p className="eyebrow">{category.navLabel}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <div className="category-page-meta">
          <span>{liveCount} live products</span>
          <span>{plannedCount} planned placeholders</span>
        </div>
        <div className="hero-actions">
          <Link className="button button-secondary" href="/shop">
            Back To Shop
          </Link>
          <Link className="button button-secondary" href="/categories">
            View All Categories
          </Link>
        </div>
      </div>

      <div className="subcategory-section-list">
        {groups.map((group) => (
          <section className="subcategory-section" key={group.slug}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{category.name}</p>
                <h2>{group.name}</h2>
              </div>
              <p className="subcategory-count">
                {group.liveCount} live • {group.plannedCount} planned
              </p>
            </div>

            {group.items.length > 0 ? (
              <div className="product-grid">
                {group.items.map((product) => (
                  <ProductCard key={`${group.slug}-${product.slug}`} product={product} />
                ))}
              </div>
            ) : (
              <article className="info-card empty-state-card">
                <p className="eyebrow">Coming Next</p>
                <h3>No products in this subcategory yet</h3>
                <p>This section is ready for products when the next items in this collection are added.</p>
              </article>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
