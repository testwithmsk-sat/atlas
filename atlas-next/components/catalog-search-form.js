import Link from "next/link";

export function CatalogSearchForm({
  action = "/shop",
  query = "",
  totalCount = 0,
  resultCount = 0,
  placeholder = "Search by product name, type, or keyword"
}) {
  const hasQuery = query.trim().length > 0;
  const summary = hasQuery
    ? `${resultCount} of ${totalCount} products match "${query}".`
    : `Search across ${totalCount} products.`;

  return (
    <div className="catalog-search-panel">
      <form className="catalog-search-form" action={action} role="search">
        <label className="catalog-search-field">
          <span className="catalog-search-label">Search products</span>
          <input
            className="catalog-search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder={placeholder}
            autoComplete="off"
          />
        </label>
        <button className="button button-primary" type="submit">
          Search
        </button>
        {hasQuery ? (
          <Link className="button button-secondary" href={action}>
            Clear
          </Link>
        ) : null}
      </form>
      <p className="catalog-search-summary">{summary}</p>
    </div>
  );
}
