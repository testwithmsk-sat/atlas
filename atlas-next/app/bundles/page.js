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
        <p className="eyebrow">Bundle Offer</p>
        <h1>One wedding bundle, priced to convert.</h1>
        <p>
          The main bundle packages the full editable wedding collection into a single premium offer with the guide
          included free.
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
