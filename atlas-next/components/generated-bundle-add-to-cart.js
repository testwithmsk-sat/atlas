"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function GeneratedBundleAddToCartButton({
  sessionId,
  bundleName,
  priceLabel,
  includedFormats = [],
  deliverables = [],
  image = "",
  className = "button button-primary"
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({
      kind: "generated_bundle",
      sessionId,
      name: bundleName,
      priceLabel,
      includedFormats,
      deliverables,
      image,
      status: "AI-generated premium bundle"
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button className={className} type="button" onClick={handleClick}>
      {added ? "Bundle Added" : "Add Full Bundle"}
    </button>
  );
}
