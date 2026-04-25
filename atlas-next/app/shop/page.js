export const metadata = {
  title: "Store Status | The Digital Atlas"
};

export default function ShopPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Store Status</p>
        <h1>No products are currently published.</h1>
        <p>The shop is intentionally empty right now. Category previews and product listings have been removed.</p>
      </div>
      <article className="info-card">
        <p className="eyebrow">Catalog Cleared</p>
        <h2>This page no longer shows categories or products.</h2>
        <p>New items can be added later, but nothing is being previewed or sold here now.</p>
      </article>
    </section>
  );
}
