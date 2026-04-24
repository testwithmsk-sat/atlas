import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getAllProducts, getProductBySlug } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found | The Digital Atlas" };
  }

  return {
    title: `${product.name} | The Digital Atlas`,
    description: product.summary
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section className="section-block product-layout">
      <div className="product-visual-card">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-summary">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="product-card-kicker">{product.subcategory || product.productType}</p>
        <p className="product-summary-text">{product.summary}</p>
        <div className="price-row">
          <strong>{product.priceLabel}</strong>
          <span>{product.status}</span>
        </div>
        <div className="product-details-grid">
          <article className="product-detail-card">
            <p className="eyebrow">Product Details</p>
            <h3>What you get</h3>
            <dl className="product-spec-list">
              <div>
                <dt>Pages</dt>
                <dd>{product.details?.pageCount || "See listing details"}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{product.productType}</dd>
              </div>
              <div>
                <dt>Editable</dt>
                <dd>{product.details?.editable || "See listing details"}</dd>
              </div>
              <div>
                <dt>Printable</dt>
                <dd>{product.details?.printable || "See listing details"}</dd>
              </div>
            </dl>
          </article>

          <article className="product-detail-card">
            <p className="eyebrow">Included</p>
            <h3>Inside this product</h3>
            <ul className="detail-list compact-detail-list">
              {(product.details?.includes || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <ul className="detail-list">
          {product.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="hero-actions">
          <AddToCartButton product={product} />
          {product.isPurchasable === false ? (
            <Link className="button button-secondary" href="/shop">
              Browse Live Products
            </Link>
          ) : (
            <Link className="button button-secondary" href="/checkout">
              Go To Checkout
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
