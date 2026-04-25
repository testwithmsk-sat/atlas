import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({ product }) {
  const hasCompareAt = product.compareAtPriceLabel && product.compareAtPriceLabel !== product.priceLabel;

  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
      </div>
      <p className="eyebrow">{product.badge}</p>
      <h3>{product.name}</h3>
      <p className="product-card-kicker">{product.subcategory || product.category}</p>
      <p>{product.summary}</p>
      <div className="card-meta">
        <div className="price-stack">
          <span className="price-offer">{product.priceLabel}</span>
          {hasCompareAt ? <span className="price-original">{product.compareAtPriceLabel}</span> : null}
        </div>
        <Link href={`/products/${product.slug}`}>View product</Link>
      </div>
      <div className="card-actions">
        <AddToCartButton product={product} className="button button-secondary product-card-button" />
      </div>
    </article>
  );
}
