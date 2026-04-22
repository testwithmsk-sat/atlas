import { ProductCard } from "@/components/product-card";
import { getAllProducts } from "@/lib/catalog";
import { getCatalogBlueprintGroups } from "@/lib/catalog-taxonomy";

export const metadata = {
  title: "Shop | The Digital Atlas"
};

export default async function ShopPage() {
  const products = await getAllProducts();
  const blueprintGroups = getCatalogBlueprintGroups();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Catalog</p>
        <h1>Build the catalog by category, then grow products inside the website.</h1>
        <p>
          This shop now includes a website-ready category directory, subcategory slugs, and a larger starter catalog
          plan. The live products below are already wired to cart, checkout, and account delivery.
        </p>
      </div>
      <section className="catalog-directory">
        {blueprintGroups.map((group) => (
          <article className="catalog-card" key={group.slug}>
            <p className="eyebrow">{group.navLabel}</p>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <div className="catalog-chip-list">
              {group.subcategories.map((subcategory) => (
                <span className="catalog-chip" key={subcategory.slug}>
                  {subcategory.name}
                </span>
              ))}
            </div>
            <p className="catalog-meta">{group.products.length} starter products planned</p>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalog Plan</p>
            <h2>Starter product list by category</h2>
          </div>
        </div>
        <div className="blueprint-grid">
          {blueprintGroups.map((group) => (
            <article className="info-card" key={group.slug}>
              <p className="eyebrow">{group.name}</p>
              <h3>{group.products.length} planned entries</h3>
              <div className="blueprint-list">
                {group.products.map((product) => (
                  <div className="blueprint-entry" key={product.slug}>
                    <strong>{product.name}</strong>
                    <p>{product.productType}</p>
                    <span>{product.stage}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live Products</p>
            <h2>Products already active for cart and checkout</h2>
          </div>
        </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      </section>
    </section>
  );
}
