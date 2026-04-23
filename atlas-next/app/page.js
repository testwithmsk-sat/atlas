import Link from "next/link";
import { CatalogCategoryCard } from "@/components/catalog-category-card";
import { ProductCard } from "@/components/product-card";
import { getCategoryDirectoryWithCounts, getFeaturedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategoryDirectoryWithCounts();
  const spotlightCategories = categories.slice(0, 4);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Digital Products</p>
          <h1>Templates, printables, and creative bundles made to sell beautifully online.</h1>
          <p className="hero-text">
            Explore category-based shopping for weddings, events, business resources, planners, and creative assets,
            all in one clean digital storefront.
          </p>
          <div className="trust-strip">
            <span>Instant digital access</span>
            <span>Category-based browsing</span>
            <span>Bundle-friendly shopping</span>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href="/shop">
              Browse Catalog
            </Link>
            <Link className="button button-secondary" href="/bundles">
              Shop Bundles
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Why Customers Love It</p>
          <div className="hero-panel-stat">
            <strong>One storefront</strong>
            <span>Wedding templates, event printables, and business assets in one cohesive shopping experience.</span>
          </div>
          <ul className="feature-list">
            <li>Browse by category instead of digging through a mixed catalog.</li>
            <li>Discover digital bundles built for weddings, events, and business use.</li>
            <li>Add products to cart and check out from inside the site.</li>
            <li>Keep purchases organized through your customer account.</li>
          </ul>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Category Spotlight</p>
            <h2>Start with the collection that matches what you need.</h2>
          </div>
          <Link className="text-link" href="/categories">
            Browse all categories
          </Link>
        </div>
        <div className="catalog-directory">
          {spotlightCategories.map((category) => (
            <CatalogCategoryCard
              key={category.slug}
              category={category}
              href={`/shop/${category.slug}`}
              liveCount={category.liveCount}
              plannedCount={category.plannedCount}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured Products</p>
            <h2>Popular products from the shop</h2>
          </div>
          <Link className="text-link" href="/best-sellers">
            Shop best sellers
          </Link>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section-block editorial-band">
        <article className="info-card editorial-lead">
          <p className="eyebrow">Curated For Fast Shopping</p>
          <h3>Designed like a storefront, not a file dump.</h3>
          <p>
            The strongest ecommerce sites feel guided. This homepage uses clearer category entry points, tighter
            product storytelling, and visible trust cues so customers know where to click next.
          </p>
        </article>
        <article className="info-card editorial-note">
          <p className="eyebrow">Most Loved Collections</p>
          <h3>Weddings, celebrations, and business templates lead the catalog.</h3>
          <p>
            That mix gives the site a stronger merchandising rhythm: emotional categories for discovery and practical
            categories for repeat-use products.
          </p>
        </article>
      </section>

      <section className="section-block split-panel">
        <article className="info-card">
          <p className="eyebrow">Shop With Confidence</p>
          <h3>Clear navigation, cleaner pricing, and faster product discovery</h3>
          <p>
            Use the main navigation to jump into category pages, curated bundles, and top-performing products without
            losing your place in the storefront.
          </p>
        </article>
        <article className="info-card">
          <p className="eyebrow">Built To Convert</p>
          <h3>A storefront that feels curated instead of crowded</h3>
          <p>
            The goal is a polished shopping flow: discover a collection, compare products, add to cart, and move into
            checkout without confusing detours.
          </p>
        </article>
      </section>
    </>
  );
}
