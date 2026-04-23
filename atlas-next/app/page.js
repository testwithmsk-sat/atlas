import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Future Ecommerce Build</p>
          <h1>Build the full store inside the website, not around it.</h1>
          <p className="hero-text">
            This new app is the migration foundation for a real product catalog, in-site cart, account access,
            digital delivery, and Razorpay checkout for Indian payments.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Browse Catalog
            </Link>
            <Link className="button button-secondary" href="/checkout">
              View Checkout Plan
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">What Changes Next</p>
          <ul className="feature-list">
            <li>Products will be managed from data instead of hard-coded HTML pages.</li>
            <li>Cart and checkout will happen inside the site.</li>
            <li>Customer accounts will unlock downloads and order history.</li>
            <li>Razorpay and database wiring can be added on top of this structure.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Products</p>
            <h2>Starter catalog for the Next.js rebuild</h2>
          </div>
          <Link className="text-link" href="/shop">
            Open full shop
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block split-panel">
        <article className="info-card">
          <p className="eyebrow">Store Architecture</p>
          <h3>Menu direction for the full ecommerce version</h3>
          <p>
            The final nav should support shopping first: Shop, Categories, Bundles, Best Sellers, New Arrivals,
            Freebies, Support, Account, and Cart.
          </p>
        </article>
        <article className="info-card">
          <p className="eyebrow">Payments Later</p>
          <h3>In-site checkout roadmap</h3>
          <p>
            This starter app includes a checkout route now so we can wire Razorpay, email confirmations, and digital
            download delivery in the next phase without rebuilding again.
          </p>
        </article>
      </section>
    </>
  );
}
