import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { buildCategorySections, getBestSellerProducts, partitionProducts } from "@/lib/catalog";

export const metadata = {
  title: "Best Sellers | The Digital Atlas",
  description: "Top storefront offers from The Digital Atlas."
};

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();
  const { bundleProducts, bundleFileProducts, standaloneProducts } = partitionProducts(products);
  const bundleSections = buildCategorySections(bundleProducts);
  const bundleFileSections = buildCategorySections(bundleFileProducts);
  const standaloneSections = buildCategorySections(standaloneProducts);
  const bundleCount = bundleProducts.length;

  return (
    <div className="storefront-page-shell">
      <section className="section-block storefront-best-sellers-hero" data-reveal>
        <div className="storefront-category-hero-grid">
          <div className="page-intro storefront-category-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Best sellers</p>
            <h1>The strongest offers in the storefront, merchandised for momentum.</h1>
            <p>
              These are the products to keep in the spotlight when you want the storefront to feel premium fast:
              proven bundles, clear planning tools, and easy add-on files.
            </p>
            <div className="catalog-chip-list storefront-chip-cluster">
              <Link className="catalog-chip" href="/shop">
                Back to shop
              </Link>
              <Link className="catalog-chip" href="/categories">
                Browse categories
              </Link>
              <Link className="catalog-chip" href="/bundles">
                Open bundles
              </Link>
            </div>
          </div>

          <div className="storefront-signal-grid storefront-signal-grid--compact" data-reveal>
            <article className="storefront-signal-card">
              <span>Total picks</span>
              <strong>{products.length}</strong>
              <p>Curated hero products that can anchor the premium side of the store.</p>
            </article>
            <article className="storefront-signal-card">
              <span>Bundle heavy</span>
              <strong>{bundleCount}</strong>
              <p>Grouped offers designed to lift perceived value and average order size.</p>
            </article>
            <article className="storefront-signal-card">
              <span>Bundle files</span>
              <strong>{bundleFileProducts.length}</strong>
              <p>High-performing single-file products that also live inside bundles.</p>
            </article>
          </div>
        </div>
      </section>

      {bundleProducts.length > 0 ? (
        <section className="section-block storefront-group-shell" data-reveal>
          <div className="section-heading storefront-section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Best-selling bundles</p>
              <h2>Top grouped offers first.</h2>
            </div>
          </div>
          <div className="subcategory-section-list storefront-group-list">
            {bundleSections.map((section) => (
              <section className="subcategory-section storefront-group-section" key={`best-bundles-${section.category.slug}`}>
                <div className="section-heading storefront-section-heading">
                  <div>
                    <p className="eyebrow eyebrow--electric">{section.category.navLabel}</p>
                    <h2>{section.products.length} bundle offer{section.products.length === 1 ? "" : "s"}</h2>
                  </div>
                  <span className="storefront-subcategory-hint">Best-selling grouped offers</span>
                </div>
                <div className="product-grid storefront-product-grid">
                  {section.products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {bundleFileProducts.length > 0 ? (
        <section className="section-block storefront-group-shell" data-reveal>
          <div className="section-heading storefront-section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Best-selling bundle files</p>
              <h2>Single files that also strengthen the larger bundle ecosystem.</h2>
            </div>
          </div>
          <div className="subcategory-section-list storefront-group-list">
            {bundleFileSections.map((section) => (
              <section className="subcategory-section storefront-group-section" key={`best-bundle-files-${section.category.slug}`}>
                <div className="section-heading storefront-section-heading">
                  <div>
                    <p className="eyebrow eyebrow--electric">{section.category.navLabel}</p>
                    <h2>{section.products.length} bundle file{section.products.length === 1 ? "" : "s"}</h2>
                  </div>
                  <span className="storefront-subcategory-hint">Best sellers inside bundle ecosystems</span>
                </div>
                <div className="product-grid storefront-product-grid">
                  {section.products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {standaloneProducts.length > 0 ? (
        <section className="section-block storefront-group-shell" data-reveal>
          <div className="section-heading storefront-section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Best-selling standalone files</p>
              <h2>Strong independent products that are not attached to bundle collections.</h2>
            </div>
          </div>
          <div className="subcategory-section-list storefront-group-list">
            {standaloneSections.map((section) => (
              <section className="subcategory-section storefront-group-section" key={`best-standalone-${section.category.slug}`}>
                <div className="section-heading storefront-section-heading">
                  <div>
                    <p className="eyebrow eyebrow--electric">{section.category.navLabel}</p>
                    <h2>{section.products.length} standalone file{section.products.length === 1 ? "" : "s"}</h2>
                  </div>
                  <span className="storefront-subcategory-hint">Independent best sellers only</span>
                </div>
                <div className="product-grid storefront-product-grid">
                  {section.products.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
