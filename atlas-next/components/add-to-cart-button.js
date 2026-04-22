"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({ product, className = "button button-primary" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = product.isPurchasable === false;

  const handleClick = () => {
    if (disabled) return;
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button className={className} type="button" onClick={handleClick} disabled={disabled} aria-disabled={disabled}>
      {disabled ? "Coming Soon" : added ? "Added To Cart" : "Add To Cart"}
    </button>
  );
}
