export const metadata = {
  title: "Best Sellers | The Digital Atlas",
  description: "No best sellers are currently published on The Digital Atlas."
};

export default function BestSellersPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Best Sellers</p>
        <h1>No best sellers are available.</h1>
        <p>This page no longer displays any featured or top-performing products.</p>
      </div>
      <article className="info-card">
        <p className="eyebrow">Currently Empty</p>
        <h2>There are no products to highlight right now.</h2>
        <p>The storefront has been cleared so this page stays empty until a future launch.</p>
      </article>
    </section>
  );
}
