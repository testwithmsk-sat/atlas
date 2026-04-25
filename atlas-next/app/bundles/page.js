import { ProductCard } from "@/components/product-card";
import { getBundleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Bundles | The Digital Atlas",
  description: "Wedding bundle offers on The Digital Atlas."
};

export default async function BundlesPage() {
  const bundles = await getBundleProducts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Bundle Offers</p>
        <h1>Wedding bundles priced for higher-value conversions.</h1>
        <p>
          The bundle lineup now includes the flagship editable PDF collection plus planning-focused spreadsheet bundles
          for budget and vendor workflows.
        </p>
      </div>
      <div className="product-grid">
        {bundles.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
