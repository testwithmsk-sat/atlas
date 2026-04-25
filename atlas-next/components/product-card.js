import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({ product }) {
  const hasCompareAt = product.compareAtPriceLabel && product.compareAtPriceLabel !== product.priceLabel;
  const productTypeLabel = product.isBundle ? "Bundle" : "Digital file";
  const categoryLabel = product.subcategory || product.category;

  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card-topline">
        <span className="sale-pill">{product.badge}</span>
        <span className="product-card-type">{productTypeLabel}</span>
      </div>
      <h3>{product.name}</h3>
      <p className="product-card-kicker">{categoryLabel}</p>
      <p>{product.summary}</p>
      <div className="product-card-highlights">
        <span>Instant download</span>
        <span>{productTypeLabel}</span>
        <span>{categoryLabel}</span>
      </div>
      <div className="card-meta">
        <div className="price-stack">
          <span className="price-offer">{product.priceLabel}</span>
          {hasCompareAt ? <span className="price-original">{product.compareAtPriceLabel}</span> : null}
        </div>
        <Link className="product-card-link" href={`/products/${product.slug}`}>
          View product
        </Link>
      </div>
      <div className="card-actions">
        <AddToCartButton product={product} className="button button-primary product-card-button" />
      </div>
    </article>
  );
}
