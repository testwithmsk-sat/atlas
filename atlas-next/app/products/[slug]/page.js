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
    return {
      title: "Product unavailable | The Digital Atlas"
    };
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

  const hasCompareAt = product.compareAtPriceLabel && product.compareAtPriceLabel !== product.priceLabel;

  return (
    <section className="section-block">
      <div className="product-layout">
        <article className="product-visual-card">
          <img src={product.image} alt={product.name} />
        </article>

        <article className="product-summary">
          <p className="eyebrow">{product.badge}</p>
          <h1>{product.name}</h1>
          <p className="product-card-kicker">{product.subcategory}</p>
          <p className="product-summary-text">{product.summary}</p>

          <div className="price-row">
            <div className="price-stack">
              <strong>{product.priceLabel}</strong>
              {hasCompareAt ? <span className="price-original">{product.compareAtPriceLabel}</span> : null}
            </div>
            {hasCompareAt ? <span className="sale-pill">Offer price</span> : null}
          </div>

          <div className="hero-actions">
            <AddToCartButton product={product} />
            <Link className="button button-secondary" href="/shop">
              Back To Shop
            </Link>
          </div>

          <ul className="feature-list">
            {product.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="product-details-grid">
        <article className="product-detail-card">
          <p className="eyebrow">Template Details</p>
          <dl className="product-spec-list">
            <div>
              <dt>Format</dt>
              <dd>{product.details.format}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{product.details.size}</dd>
            </div>
            <div>
              <dt>Pages</dt>
              <dd>{product.details.pages}</dd>
            </div>
            <div>
              <dt>Editing</dt>
              <dd>{product.details.editable}</dd>
            </div>
            <div>
              <dt>Printing</dt>
              <dd>{product.details.printable}</dd>
            </div>
          </dl>
        </article>

        <article className="product-detail-card">
          <p className="eyebrow">{product.isBundle ? "Bundle Contents" : "What You Get"}</p>
          <ul className="feature-list compact-detail-list">
            {(product.bundleContents.length > 0 ? product.bundleContents : product.details.includes).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
