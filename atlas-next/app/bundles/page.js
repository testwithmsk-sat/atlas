import { ProductCard } from "@/components/product-card";
import { getBundleProducts } from "@/lib/catalog";

export const metadata = {
  title: "Bundles | The Digital Atlas",
  description: "Bundle offers across business, events, wedding, and home planning on The Digital Atlas."
};

export default async function BundlesPage() {
  const bundles = await getBundleProducts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Bundle Offers</p>
        <h1>Digital bundles organized across every storefront category.</h1>
        <p>
          The bundle lineup now includes business template packs, event planning collections, wedding best sellers,
          and home-planning bundles so customers can buy complete systems in one click.
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
