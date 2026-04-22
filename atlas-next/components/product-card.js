import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({ product }) {
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
        <span>{product.priceLabel}</span>
        <Link href={`/products/${product.slug}`}>View product</Link>
      </div>
      <div className="card-actions">
        <AddToCartButton product={product} className="button button-secondary product-card-button" />
      </div>
    </article>
  );
}
