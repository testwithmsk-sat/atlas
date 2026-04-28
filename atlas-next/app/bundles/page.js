import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { buildSubcategorySections, getBundleProducts } from "@/lib/catalog";
import { categoryDirectory } from "@/lib/catalog-taxonomy";

export const metadata = {
  title: "Bundles | The Digital Atlas",
  description: "Bundle offers across business, events, wedding, and home planning on The Digital Atlas."
};

export default async function BundlesPage() {
  const bundles = await getBundleProducts();
  const categorySections = categoryDirectory
    .map((category) => ({
      category,
      subcategorySections: buildSubcategorySections(
        bundles.filter((product) => product.categorySlug === category.slug),
        category
      )
    }))
    .filter((section) => section.subcategorySections.length > 0);

  return (
    <div className="storefront-page-shell">
      <section className="section-block storefront-category-directory-hero" data-reveal>
        <div className="storefront-category-hero-grid">
          <div className="page-intro storefront-category-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Bundle offers</p>
            <h1>Every bundle organized by category and subcategory.</h1>
            <p>
              This page now acts like a clean bundle index, so shoppers can browse grouped offers without mixing them
              up with single-file products.
            </p>
            <div className="catalog-chip-list storefront-chip-cluster">
              <Link className="catalog-chip" href="/shop?focus=bundles">
                View bundle lane
              </Link>
              <Link className="catalog-chip" href="/categories">
                Browse categories
              </Link>
              <Link className="catalog-chip" href="/shop">
                Back to shop
              </Link>
            </div>
          </div>

          <div className="storefront-signal-grid storefront-signal-grid--compact" data-reveal>
            <article className="storefront-signal-card">
              <span>Total bundles</span>
              <strong>{bundles.length}</strong>
              <p>Complete grouped offers that package the catalog into bigger-value purchases.</p>
            </article>
            <article className="storefront-signal-card">
              <span>Categories</span>
              <strong>{categorySections.length}</strong>
              <p>Bundle families are now separated by storefront world before the shopper drills down.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block storefront-group-shell" data-reveal>
        <div className="section-heading storefront-section-heading">
          <div>
            <p className="eyebrow eyebrow--electric">Bundle directory</p>
            <h2>Grouped offers first, organized before anything else.</h2>
          </div>
        </div>
        <div className="subcategory-section-list storefront-group-list">
          {categorySections.map((categorySection) => (
            <section className="subcategory-section storefront-group-section" key={categorySection.category.slug}>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">{categorySection.category.navLabel}</p>
                  <h2>{categorySection.category.name}</h2>
                </div>
                <span className="storefront-subcategory-hint">
                  {categorySection.subcategorySections.reduce((total, section) => total + section.products.length, 0)} bundle offer
                  {categorySection.subcategorySections.reduce((total, section) => total + section.products.length, 0) === 1 ? "" : "s"}
                </span>
              </div>

              <div className="subcategory-section-list storefront-group-list">
                {categorySection.subcategorySections.map((subcategorySection) => (
                  <section
                    className="subcategory-section storefront-group-section"
                    key={`${categorySection.category.slug}-${subcategorySection.subcategory.slug}`}
                  >
                    <div className="section-heading storefront-section-heading">
                      <div>
                        <p className="eyebrow eyebrow--electric">{subcategorySection.subcategory.name}</p>
                        <h2>{subcategorySection.products.length} bundle offer{subcategorySection.products.length === 1 ? "" : "s"}</h2>
                      </div>
                      <span className="storefront-subcategory-hint">Bundle products only</span>
                    </div>
                    <div className="product-grid storefront-product-grid">
                      {subcategorySection.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
