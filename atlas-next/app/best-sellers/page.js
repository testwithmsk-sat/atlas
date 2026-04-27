import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getBestSellerProducts } from "@/lib/catalog";

export const metadata = {
  title: "Best Sellers | The Digital Atlas",
  description: "Top storefront offers from The Digital Atlas."
};

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();
  const bundleCount = products.filter((product) => product.isBundle).length;
  const singleCount = products.length - bundleCount;

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
              <span>Quick add-ons</span>
              <strong>{singleCount}</strong>
              <p>Focused single-file products for lower-friction decisions.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-block storefront-shelf" data-reveal>
        <div className="product-grid storefront-product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
