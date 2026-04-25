export const metadata = {
  title: "Bundles | The Digital Atlas",
  description: "No bundles are currently published on The Digital Atlas."
};

export default function BundlesPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Bundles</p>
        <h1>No bundles are live right now.</h1>
        <p>This page has been cleared and no bundle previews are being shown.</p>
      </div>
      <article className="info-card">
        <p className="eyebrow">Empty State</p>
        <h2>Bundle listings have been removed.</h2>
        <p>There is nothing to browse here until new products are published again.</p>
      </article>
    </section>
  );
}
