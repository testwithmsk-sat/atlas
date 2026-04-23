import { ProductCard } from "@/components/product-card";
import { getBundleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Bundles | The Digital Atlas",
  description: "Shop curated digital bundles from The Digital Atlas."
};

export default async function BundlesPage() {
  const bundles = await getBundleProducts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Bundles</p>
        <h1>Curated bundles for faster shopping.</h1>
        <p>Explore grouped offers and multi-item collections designed for weddings, events, and business needs.</p>
      </div>

      <div className="product-grid">
        {bundles.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
