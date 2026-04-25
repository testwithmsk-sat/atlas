import { ProductCard } from "@/components/product-card";
import { getBestSellerProducts } from "@/lib/catalog";

export const metadata = {
  title: "Best Sellers | The Digital Atlas",
  description: "Top wedding template offers from The Digital Atlas."
};

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Best Sellers</p>
        <h1>The strongest wedding offers on the storefront.</h1>
        <p>These are the hero products to feature for bundle conversions, planning sales, and day-of add-ons.</p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
