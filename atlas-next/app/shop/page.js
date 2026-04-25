import { ProductCard } from "@/components/product-card";
import { getAllProducts, getBundleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop | The Digital Atlas"
};

export default async function ShopPage() {
  const [products, bundleProducts] = await Promise.all([getAllProducts(), getBundleProducts()]);
  const individualProducts = products.filter((product) => product.isBundle !== true);

  return (
    <>
      <section className="section-block">
        <div className="page-intro">
          <p className="eyebrow">Wedding Shop</p>
          <h1>Wedding templates, spreadsheets, and printables in one storefront.</h1>
          <p>
            Shop multiple bundle offers or sell the collection one file at a time across planning, stationery, signs,
            and party extras.
          </p>
        </div>
      </section>

      {bundleProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Bundle Deals</p>
              <h2>The premium offers on the site.</h2>
            </div>
          </div>
          <div className="product-grid">
            {bundleProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Individual Templates</p>
            <h2>Sell the collection one piece at a time too.</h2>
          </div>
        </div>
        <div className="product-grid">
          {individualProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
