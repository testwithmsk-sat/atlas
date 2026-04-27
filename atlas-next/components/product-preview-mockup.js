function getMockupVariant(product) {
  const format = String(product.details?.format || "").toLowerCase();

  if (product.isBundle) return "stack";
  if (format.includes("excel") || format.includes("xlsx") || format.includes("spreadsheet")) return "tablet";
  return "paper";
}

export function ProductPreviewMockup({ product, className = "", priority = "default" }) {
  const variant = getMockupVariant(product);
  const classes = ["product-mockup", `product-mockup--${variant}`, className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-priority={priority}>
      <div className="product-mockup-scene">
        <div className="product-mockup-aura" aria-hidden="true" />
        <div className="product-mockup-floor" aria-hidden="true" />
        <div className="product-mockup-shadow" aria-hidden="true" />
        <div className="product-mockup-orbit product-mockup-orbit--one" aria-hidden="true" />
        <div className="product-mockup-orbit product-mockup-orbit--two" aria-hidden="true" />
        <div className="product-mockup-shell">
          <div className="product-mockup-layer product-mockup-layer--back" aria-hidden="true" />
          <div className="product-mockup-layer product-mockup-layer--mid" aria-hidden="true" />
          <div className="product-mockup-frame">
            <div className="product-mockup-frame-gloss" aria-hidden="true" />
            <img src={product.image} alt={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
