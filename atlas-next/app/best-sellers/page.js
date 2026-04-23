import { ProductCard } from "@/components/product-card";
import { getBestSellerProducts } from "@/lib/catalog";

export const metadata = {
  title: "Best Sellers | The Digital Atlas",
  description: "Browse best-selling digital products from The Digital Atlas."
};

export default async function BestSellersPage() {
  const products = await getBestSellerProducts();

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Best Sellers</p>
        <h1>Top products customers shop first.</h1>
        <p>Start with some of the most popular purchasable products currently featured in the storefront.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
