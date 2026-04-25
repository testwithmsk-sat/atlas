export const metadata = {
  title: "Categories | The Digital Atlas",
  description: "Category browsing is currently unavailable because the site is empty."
};

export default function CategoriesPage() {
  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Categories</p>
        <h1>No category previews are being shown.</h1>
        <p>The site has been cleared, so category cards and preview sections are not displayed.</p>
      </div>
      <article className="info-card">
        <p className="eyebrow">Currently Empty</p>
        <h2>There are no collections to browse right now.</h2>
        <p>Once future updates are ready, category browsing can be turned back on.</p>
      </article>
    </section>
  );
}
