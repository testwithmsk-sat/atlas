import Link from "next/link";
import { CatalogSearchForm } from "@/components/catalog-search-form";
import { ProductCard } from "@/components/product-card";
import { parsePriceLabel, getAllProducts, searchProducts } from "@/lib/catalog";
import { categoryDirectory } from "@/lib/catalog-taxonomy";
import { supportsOnlineEditor } from "@/lib/pdf-editor";

const focusModes = [
  { key: "all", label: "All products" },
  { key: "bundles", label: "Bundle drops" },
  { key: "singles", label: "Single files" },
  { key: "editor", label: "Edit online" }
];

const sortModes = [
  { key: "featured", label: "Featured first" },
  { key: "price-low", label: "Lowest price" },
  { key: "price-high", label: "Highest price" },
  { key: "az", label: "A to Z" }
];

function buildShopHref(query, options = {}) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (options.category) params.set("category", options.category);
  if (options.focus && options.focus !== "all") params.set("focus", options.focus);
  if (options.sort && options.sort !== "featured") params.set("sort", options.sort);

  const search = params.toString();
  return search ? `/shop?${search}` : "/shop";
}

function sortProducts(products, sortKey) {
  const sorted = [...products];

  switch (sortKey) {
    case "price-low":
      return sorted.sort((left, right) => parsePriceLabel(left.priceLabel) - parsePriceLabel(right.priceLabel));
    case "price-high":
      return sorted.sort((left, right) => parsePriceLabel(right.priceLabel) - parsePriceLabel(left.priceLabel));
    case "az":
      return sorted.sort((left, right) => left.name.localeCompare(right.name));
    case "featured":
    default:
      return sorted.sort((left, right) => {
        const leftScore =
          (left.isFeatured ? 4 : 0) + (left.isBestSeller ? 3 : 0) + (left.isBundle ? 2 : 0) + parsePriceLabel(left.priceLabel) * 0.01;
        const rightScore =
          (right.isFeatured ? 4 : 0) + (right.isBestSeller ? 3 : 0) + (right.isBundle ? 2 : 0) + parsePriceLabel(right.priceLabel) * 0.01;

        return rightScore - leftScore;
      });
  }
}

function filterProducts(products, { categorySlug, focusKey }) {
  return products.filter((product) => {
    if (categorySlug && product.categorySlug !== categorySlug) return false;
    if (focusKey === "bundles" && !product.isBundle) return false;
    if (focusKey === "singles" && product.isBundle) return false;
    if (focusKey === "editor" && !supportsOnlineEditor(product)) return false;
    return true;
  });
}

export const metadata = {
  title: "Shop | The Digital Atlas"
};

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q.trim() : "";
  const requestedCategory =
    typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category.trim().toLowerCase() : "";
  const requestedFocus = typeof resolvedSearchParams?.focus === "string" ? resolvedSearchParams.focus.trim().toLowerCase() : "all";
  const requestedSort = typeof resolvedSearchParams?.sort === "string" ? resolvedSearchParams.sort.trim().toLowerCase() : "featured";

  const categorySlug = categoryDirectory.some((category) => category.slug === requestedCategory) ? requestedCategory : "";
  const focusKey = focusModes.some((mode) => mode.key === requestedFocus) ? requestedFocus : "all";
  const sortKey = sortModes.some((mode) => mode.key === requestedSort) ? requestedSort : "featured";

  const products = await getAllProducts();
  const searchedProducts = searchProducts(products, searchQuery);
  const filteredProducts = sortProducts(filterProducts(searchedProducts, { categorySlug, focusKey }), sortKey);
  const bundleProducts = filteredProducts.filter((product) => product.isBundle === true);
  const singleProducts = filteredProducts.filter((product) => product.isBundle !== true);
  const bundleFileProducts = singleProducts.filter((product) => product.parentBundleSlugs?.length > 0);
  const standaloneProducts = singleProducts.filter((product) => (product.parentBundleSlugs?.length || 0) === 0);
  const editorReadyProducts = filteredProducts.filter((product) => supportsOnlineEditor(product));
  const bestSellerProducts = filteredProducts.filter((product) => product.isBestSeller === true).slice(0, 3);
  const spotlightProduct = bestSellerProducts[0] || bundleProducts[0] || filteredProducts[0] || null;
  const hasResults = filteredProducts.length > 0;
  const categorySummaries = categoryDirectory
    .map((category) => {
      const matches = searchedProducts.filter((product) => product.categorySlug === category.slug).length;
      return {
        ...category,
        matches
      };
    })
    .filter((category) => category.matches > 0);

  const signalCards = [
    {
      label: "Products shown",
      value: filteredProducts.length,
      copy: searchQuery ? "Matching the current search and filters." : "Live items available to browse right now."
    },
    {
      label: "Bundle offers",
      value: bundleProducts.length,
      copy: "High-value grouped offers merchandised as the premium first choice."
    },
    {
      label: "Bundle files",
      value: bundleFileProducts.length,
      copy: "Single-file listings that also belong to a larger bundle collection."
    }
  ];

  return (
    <div className="storefront-page-shell">
      <section className="section-block storefront-shop-hero" data-reveal>
        <div className="storefront-shop-hero-grid">
          <div className="storefront-shop-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">Premium storefront</p>
            <h1>Browse bundles, single files, and editor-ready products with less friction.</h1>
            <p>
              The shop now acts like a discovery system, not just a list. Search by intent, move between category
              worlds, and push shoppers toward the right product lane faster.
            </p>
            <CatalogSearchForm
              action="/shop"
              query={searchQuery}
              totalCount={products.length}
              resultCount={filteredProducts.length}
            />
            <div className="storefront-pill-rail">
              {focusModes.map((mode) => {
                const isActive = focusKey === mode.key;
                return (
                  <Link
                    className={`storefront-pill${isActive ? " is-active" : ""}`}
                    key={mode.key}
                    href={buildShopHref(searchQuery, {
                      category: categorySlug,
                      focus: mode.key,
                      sort: sortKey
                    })}
                  >
                    {mode.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="storefront-shop-aside" data-reveal>
            <article className="storefront-spotlight-card">
              <p className="eyebrow eyebrow--electric">Storefront spotlight</p>
              <h2>{spotlightProduct ? spotlightProduct.name : "Curated digital picks"}</h2>
              <p>
                {spotlightProduct
                  ? `${spotlightProduct.summary} ${spotlightProduct.priceLabel} keeps the entry point clear while the higher-value visual treatment makes it feel premium.`
                  : "Lead with the product that best represents the category, then let the rest of the storefront support the decision."}
              </p>
              <div className="catalog-chip-list storefront-chip-cluster">
                {spotlightProduct ? (
                  <>
                    <span className="catalog-chip">{spotlightProduct.priceLabel}</span>
                    <span className="catalog-chip">{spotlightProduct.isBundle ? "Bundle" : "Single file"}</span>
                    <span className="catalog-chip">{spotlightProduct.category}</span>
                  </>
                ) : null}
              </div>
              <div className="hero-actions">
                <Link className="button button-primary" href={spotlightProduct ? `/products/${spotlightProduct.slug}` : "/best-sellers"}>
                  View spotlight
                </Link>
                <Link className="button button-secondary" href="/best-sellers">
                  Best sellers
                </Link>
              </div>
            </article>

            <div className="storefront-signal-grid">
              {signalCards.map((card) => (
                <article className="storefront-signal-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-block storefront-filter-shell" data-reveal>
        <div className="storefront-filter-bar">
          <div className="storefront-filter-group">
            <p className="eyebrow">Category rail</p>
            <div className="storefront-pill-rail storefront-pill-rail--dense">
              <Link
                className={`storefront-pill${!categorySlug ? " is-active" : ""}`}
                href={buildShopHref(searchQuery, { focus: focusKey, sort: sortKey })}
              >
                All categories
              </Link>
              {categorySummaries.map((category) => (
                <Link
                  className={`storefront-pill${categorySlug === category.slug ? " is-active" : ""}`}
                  key={category.slug}
                  href={buildShopHref(searchQuery, {
                    category: category.slug,
                    focus: focusKey,
                    sort: sortKey
                  })}
                >
                  {category.navLabel}
                  <span>{category.matches}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="storefront-filter-group">
            <p className="eyebrow">Sort lane</p>
            <div className="storefront-pill-rail storefront-pill-rail--dense">
              {sortModes.map((mode) => (
                <Link
                  className={`storefront-pill${sortKey === mode.key ? " is-active" : ""}`}
                  key={mode.key}
                  href={buildShopHref(searchQuery, {
                    category: categorySlug,
                    focus: focusKey,
                    sort: mode.key
                  })}
                >
                  {mode.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {hasResults ? (
        <>
          {bundleProducts.length > 0 ? (
            <section className="section-block storefront-shelf" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Bundle lane</p>
                  <h2>{searchQuery ? "High-value matches that group more of the work together." : "Premium grouped offers for faster yeses and bigger carts."}</h2>
                </div>
                <Link className="text-link" href={buildShopHref(searchQuery, { category: categorySlug, focus: "bundles", sort: sortKey })}>
                  View bundles only
                </Link>
              </div>
              <div className="product-grid storefront-product-grid">
                {bundleProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {bundleFileProducts.length > 0 ? (
            <section className="section-block storefront-shelf" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Bundle-file lane</p>
                  <h2>{searchQuery ? "Single-file matches that are also part of a larger bundle." : "Single files organized by the bundle collections they belong to."}</h2>
                </div>
                <Link className="text-link" href={buildShopHref(searchQuery, { category: categorySlug, focus: "singles", sort: sortKey })}>
                  View singles only
                </Link>
              </div>
              <div className="product-grid storefront-product-grid">
                {bundleFileProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {standaloneProducts.length > 0 ? (
            <section className="section-block storefront-shelf" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Standalone single-file lane</p>
                  <h2>{searchQuery ? "Focused matches that are not attached to a bundle collection." : "Standalone files kept separate from the bundle ecosystems."}</h2>
                </div>
                <Link className="text-link" href={buildShopHref(searchQuery, { category: categorySlug, focus: "singles", sort: sortKey })}>
                  Review all singles
                </Link>
              </div>
              <div className="product-grid storefront-product-grid">
                {standaloneProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ) : null}

          {bestSellerProducts.length > 0 ? (
            <section className="section-block storefront-discovery-band" data-reveal>
              <article className="catalog-card storefront-discovery-card">
                <p className="eyebrow eyebrow--electric">Momentum builder</p>
                <h2>Keep shoppers moving with stronger routes, not more clutter.</h2>
                <p>
                  Featured-first sorting pulls the strongest offers to the top, while category rails and search keep the
                  experience feeling curated instead of overwhelming.
                </p>
                <div className="catalog-chip-list storefront-chip-cluster">
                  <Link className="catalog-chip" href="/categories">
                    Browse categories
                  </Link>
                  <Link className="catalog-chip" href="/best-sellers">
                    Visit best sellers
                  </Link>
                  <Link className="catalog-chip" href="/bundles">
                    Jump to bundles
                  </Link>
                </div>
              </article>
              <article className="info-card storefront-shortlist-card">
                <p className="eyebrow eyebrow--electric">Top matches</p>
                <div className="storefront-shortlist">
                  {bestSellerProducts.map((product) => (
                    <Link className="storefront-shortlist-item" href={`/products/${product.slug}`} key={product.slug}>
                      <span>{product.name}</span>
                      <strong>{product.priceLabel}</strong>
                    </Link>
                  ))}
                </div>
              </article>
            </section>
          ) : null}
        </>
      ) : (
        <section className="section-block" data-reveal>
          <article className="info-card empty-state-card storefront-empty-card">
            <p className="eyebrow eyebrow--electric">No matches</p>
            <h3>No products matched "{searchQuery}".</h3>
            <p>Try broader keywords like invitation, planner, bundle, checklist, spreadsheet, or editable PDF.</p>
            <div className="catalog-chip-list storefront-chip-cluster">
              <Link className="catalog-chip" href="/shop?q=planner">
                Search planners
              </Link>
              <Link className="catalog-chip" href="/shop?q=bundle">
                Search bundles
              </Link>
              <Link className="catalog-chip" href="/shop">
                Reset the shop
              </Link>
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
