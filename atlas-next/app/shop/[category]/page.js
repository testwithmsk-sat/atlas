import Link from "next/link";
import { notFound } from "next/navigation";
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
    description: "This category is currently empty."
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) notFound();

  const { category } = categoryPage;

  return (
    <section className="section-block">
      <div className="page-intro category-page-intro">
        <p className="eyebrow">{category.navLabel}</p>
        <h1>{category.name}</h1>
        <p>This category is currently empty. No products or previews are being shown here.</p>
        <div className="hero-actions">
          <Link className="button button-secondary" href="/shop">
            Back To Store Status
          </Link>
          <Link className="button button-secondary" href="/categories">
            View Categories Status
          </Link>
        </div>
      </div>

      <article className="info-card empty-state-card">
        <p className="eyebrow">No Listings</p>
        <h3>This collection has been cleared.</h3>
        <p>There are no items, subcategory previews, or purchasable products in this category right now.</p>
      </article>
    </section>
  );
}
