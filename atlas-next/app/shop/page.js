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
          <h1>Digital templates, spreadsheets, and printables across every live category.</h1>
          <p>
            Browse bundles and single files across business, events, wedding, and planning so customers can either buy
            complete systems or quick add-ons.
          </p>
          <CatalogSearchForm
            action="/shop"
            query={searchQuery}
            totalCount={products.length}
            resultCount={filteredProducts.length}
          />
        </div>
      </section>

      {bundleProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Bundle Deals</p>
              <h2>{searchQuery ? "Matching bundle deals." : "The premium offers on the site."}</h2>
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
              <h2>{searchQuery ? "Matching individual products." : "Sell the collection one piece at a time too."}</h2>
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
