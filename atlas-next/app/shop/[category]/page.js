import Link from "next/link";
import { CatalogSearchForm } from "@/components/catalog-search-form";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCategoryPageData, searchProducts } from "@/lib/catalog";
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
    description: `${categoryPage.category.name} products on The Digital Atlas.`
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category: categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q.trim() : "";
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) notFound();

  const { category } = categoryPage;
  const filteredGroups = categoryPage.groups
    .map((group) => ({
      ...group,
      products: searchProducts(group.products, searchQuery)
    }))
    .filter((group) => group.products.length > 0);
  const filteredCount = filteredGroups.reduce((total, group) => total + group.products.length, 0);

  return (
    <section className="section-block">
      <div className="page-intro category-page-intro">
        <p className="eyebrow">{category.navLabel}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <div className="category-page-meta">
          <span>{filteredCount} shown</span>
          <span>{categoryPage.liveCount} live products</span>
          <span>{category.subcategories.length} subcategories</span>
        </div>
        <CatalogSearchForm
          action={`/shop/${category.slug}`}
          query={searchQuery}
          totalCount={categoryPage.liveCount}
          resultCount={filteredCount}
          placeholder={`Search ${category.name.toLowerCase()} products`}
        />
        <div className="hero-actions">
          <Link className="button button-secondary" href="/shop">
            Back To Shop
          </Link>
          <Link className="button button-secondary" href="/bundles">
            View Bundle
          </Link>
        </div>
      </div>

      {categoryPage.groups.length === 0 ? (
        <article className="info-card empty-state-card">
          <p className="eyebrow">Coming Soon</p>
          <h3>No live products are published in this category yet.</h3>
          <p>This category is part of the wider catalog plan, but the wedding collection is the only live launch right now.</p>
        </article>
      ) : filteredGroups.length === 0 ? (
        <article className="info-card empty-state-card">
          <p className="eyebrow">No Matches</p>
          <h3>No {category.name.toLowerCase()} products matched "{searchQuery}".</h3>
          <p>Try a broader keyword like invitation, planner, bundle, checklist, or spreadsheet.</p>
        </article>
      ) : (
        <div className="subcategory-section-list">
          {filteredGroups.map((group) => (
            <section className="subcategory-section" key={group.subcategory.slug}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{group.subcategory.name}</p>
                  <h2>{group.products.length} product{group.products.length === 1 ? "" : "s"}</h2>
                </div>
              </div>
              <div className="product-grid">
                {group.products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
