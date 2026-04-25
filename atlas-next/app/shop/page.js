import { CatalogSearchForm } from "@/components/catalog-search-form";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, searchProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop | The Digital Atlas"
};

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q.trim() : "";
  const products = await getAllProducts();
  const filteredProducts = searchProducts(products, searchQuery);
  const bundleProducts = filteredProducts.filter((product) => product.isBundle === true);
  const individualProducts = filteredProducts.filter((product) => product.isBundle !== true);
  const hasResults = filteredProducts.length > 0;

  return (
    <>
      <section className="section-block">
        <div className="page-intro">
          <p className="eyebrow">Shop</p>
          <h1>A cleaner, more premium storefront for templates, printables, and bundles.</h1>
          <p>
            Browse across business, events, wedding, and planning with a clearer split between premium bundles and
            individual files. The goal is simple: help customers find the right product faster and buy with confidence.
          </p>
          <CatalogSearchForm
            action="/shop"
            query={searchQuery}
            totalCount={products.length}
            resultCount={filteredProducts.length}
          />
        </div>
        <div className="shop-overview-grid">
          <article className="catalog-card shop-overview-card">
            <p className="eyebrow">Why This Store Feels Better</p>
            <h2>Sharper hierarchy, stronger bundles, easier browsing.</h2>
            <p>
              The storefront works best when people can instantly tell what the premium offer is, what the fast add-on
              is, and what they receive after purchase.
            </p>
          </article>
          <article className="info-card shop-overview-note">
            <p className="eyebrow">Buying Signals</p>
            <ul className="feature-list compact-detail-list">
              <li>Instant digital delivery across the catalog</li>
              <li>Low-friction single products plus higher-value bundles</li>
              <li>Search-led discovery for shoppers with clear intent</li>
            </ul>
          </article>
        </div>
      </section>

      {bundleProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Bundle Deals</p>
              <h2>{searchQuery ? "Matching premium bundles." : "The strongest premium offers in the store."}</h2>
            </div>
          </div>
          <div className="product-grid">
            {bundleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      {!searchQuery || individualProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Individual Templates</p>
              <h2>{searchQuery ? "Matching individual products." : "Professional single-file products for quick decisions."}</h2>
            </div>
          </div>
          {individualProducts.length > 0 ? (
            <div className="product-grid">
              {individualProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {!hasResults ? (
        <section className="section-block">
          <article className="info-card empty-state-card">
            <p className="eyebrow">No Matches</p>
            <h3>No products matched "{searchQuery}".</h3>
            <p>Try a broader keyword like invitation, planner, bundle, RSVP, budget, or sign.</p>
          </article>
        </section>
      ) : null}
    </>
  );
}
