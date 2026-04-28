import Link from "next/link";
import { CatalogSearchForm } from "@/components/catalog-search-form";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { buildSubcategorySections, getCategoryPageData, partitionProducts, searchProducts } from "@/lib/catalog";
import { categoryDirectory } from "@/lib/catalog-taxonomy";
import { absoluteUrl, bundlePriceFloorLabel, storePriceRangeLabel, toJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return categoryDirectory.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) {
    return { title: "Category not found | The Digital Atlas" };
  }

  const { category, liveCount } = categoryPage;
  const subcategoryNames = category.subcategories.map((subcategory) => subcategory.name).join(", ");
  const seoDescription = `Shop ${category.name.toLowerCase()} digital templates, printables, and bundle downloads from The Digital Atlas. Most single files are priced from ${storePriceRangeLabel}, with bundle deals from ${bundlePriceFloorLabel}. Explore ${liveCount} products across ${subcategoryNames}.`;

  return {
    title: `${category.name} Digital Templates From ${storePriceRangeLabel}`,
    description: seoDescription,
    keywords: [
      `${category.name.toLowerCase()} templates`,
      `${category.name.toLowerCase()} templates ${storePriceRangeLabel}`,
      `${category.name.toLowerCase()} printables`,
      `${category.name.toLowerCase()} digital downloads`,
      ...category.subcategories.map((subcategory) => subcategory.name.toLowerCase())
    ],
    alternates: {
      canonical: `/shop/${category.slug}`
    },
    openGraph: {
      title: `${category.name} Digital Templates From ${storePriceRangeLabel} | The Digital Atlas`,
      description: seoDescription,
      url: absoluteUrl(`/shop/${category.slug}`)
    }
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { category: categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const searchQuery = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q.trim() : "";
  const categoryPage = await getCategoryPageData(categorySlug);

  if (!categoryPage) notFound();

  const { category } = categoryPage;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: absoluteUrl("/categories")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: absoluteUrl(`/shop/${category.slug}`)
      }
    ]
  };

  const filteredGroups = categoryPage.groups
    .map((group) => ({
      ...group,
      products: searchProducts(group.products, searchQuery)
    }))
    .filter((group) => group.products.length > 0);
  const filteredProducts = filteredGroups.flatMap((group) => group.products);
  const { bundleProducts, bundleFileProducts, standaloneProducts } = partitionProducts(filteredProducts);
  const bundleSections = buildSubcategorySections(bundleProducts, category);
  const bundleFileSections = buildSubcategorySections(bundleFileProducts, category);
  const standaloneSections = buildSubcategorySections(standaloneProducts, category);
  const sectionAnchorBySubcategory = new Map();

  bundleSections.forEach((group) => {
    sectionAnchorBySubcategory.set(group.subcategory.slug, `bundle-${group.subcategory.slug}`);
  });

  bundleFileSections.forEach((group) => {
    if (!sectionAnchorBySubcategory.has(group.subcategory.slug)) {
      sectionAnchorBySubcategory.set(group.subcategory.slug, group.subcategory.slug);
    }
  });

  standaloneSections.forEach((group) => {
    if (!sectionAnchorBySubcategory.has(group.subcategory.slug)) {
      sectionAnchorBySubcategory.set(group.subcategory.slug, `standalone-${group.subcategory.slug}`);
    }
  });

  const filteredCount = filteredProducts.length;
  const bundleCount = bundleProducts.length;
  const bundleFileCount = bundleFileProducts.length;
  const standaloneCount = standaloneProducts.length;
  const spotlightProduct = bundleProducts[0] || bundleFileProducts[0] || standaloneProducts[0] || null;

  return (
    <div className="storefront-page-shell">
      <section className="section-block storefront-category-hero" data-reveal>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
        />

        <div className="storefront-category-hero-grid">
          <div className="page-intro category-page-intro storefront-category-copy" data-reveal>
            <p className="eyebrow eyebrow--electric">{category.navLabel}</p>
            <h1>{category.name}</h1>
            <p>{category.description}</p>

            <div className="category-page-meta storefront-category-meta">
              <span>{filteredCount} shown</span>
              <span>{categoryPage.liveCount} live products</span>
              <span>{category.subcategories.length} subcategories</span>
            </div>

            <CatalogSearchForm
              action={`/shop/${category.slug}`}
              query={searchQuery}
              totalCount={categoryPage.liveCount}
              resultCount={filteredCount}
              placeholder={`Search ${category.name.toLowerCase()} products`}
            />

            <div className="storefront-pill-rail storefront-pill-rail--dense">
              {category.subcategories.map((subcategory) => {
                const matchingGroup = filteredGroups.find((group) => group.subcategory.slug === subcategory.slug);
                const anchorId = sectionAnchorBySubcategory.get(subcategory.slug);
                return matchingGroup ? (
                  <Link className="storefront-pill" href={anchorId ? `#${anchorId}` : "#"} key={subcategory.slug}>
                    {subcategory.name}
                    <span>{matchingGroup.products.length}</span>
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          <div className="storefront-category-aside" data-reveal>
            <article className="storefront-spotlight-card storefront-spotlight-card--category">
              <p className="eyebrow eyebrow--electric">Category spotlight</p>
              <h2>{spotlightProduct ? spotlightProduct.name : `${category.name} highlights`}</h2>
              <p>
                {spotlightProduct
                  ? `${spotlightProduct.summary} Use this page as a mini landing zone for the category before shoppers drill into individual files.`
                  : `This category becomes stronger when the hero frames the tone, while the grouped shelves underneath keep browsing easy.`}
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href={spotlightProduct ? `/products/${spotlightProduct.slug}` : "/shop"}>
                  View featured item
                </Link>
                <Link className="button button-secondary" href="/shop">
                  Back to shop
                </Link>
              </div>
            </article>

            <div className="storefront-signal-grid storefront-signal-grid--compact">
              <article className="storefront-signal-card">
                <span>Bundle offers</span>
                <strong>{bundleCount}</strong>
                <p>Grouped offers that anchor the premium side of the category.</p>
              </article>
              <article className="storefront-signal-card">
                <span>Bundle files</span>
                <strong>{bundleFileCount}</strong>
                <p>Single-file products that belong to one or more larger bundles.</p>
              </article>
              <article className="storefront-signal-card">
                <span>Standalone files</span>
                <strong>{standaloneCount}</strong>
                <p>Independent products that are intentionally separate from bundle collections.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {categoryPage.groups.length === 0 ? (
        <section className="section-block" data-reveal>
          <article className="info-card empty-state-card storefront-empty-card">
            <p className="eyebrow eyebrow--electric">Coming soon</p>
            <h3>No live products are published in this category yet.</h3>
            <p>This category is planned in the broader catalog, but the live storefront is still growing into it.</p>
          </article>
        </section>
      ) : filteredGroups.length === 0 ? (
        <section className="section-block" data-reveal>
          <article className="info-card empty-state-card storefront-empty-card">
            <p className="eyebrow eyebrow--electric">No matches</p>
            <h3>No {category.name.toLowerCase()} products matched "{searchQuery}".</h3>
            <p>Try broader keywords like planner, checklist, invitation, bundle, spreadsheet, or editable PDF.</p>
          </article>
        </section>
      ) : (
        <>
          {bundleSections.length > 0 ? (
            <section className="section-block storefront-group-shell" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Bundle offers</p>
                  <h2>Primary bundle collections, grouped by subcategory.</h2>
                </div>
                <span className="storefront-subcategory-hint">Complete grouped offers</span>
              </div>
              <div className="subcategory-section-list storefront-group-list">
                {bundleSections.map((group) => (
                  <section
                    className="subcategory-section storefront-group-section"
                    id={`bundle-${group.subcategory.slug}`}
                    key={`bundle-${group.subcategory.slug}`}
                  >
                    <div className="section-heading storefront-section-heading">
                      <div>
                        <p className="eyebrow eyebrow--electric">{group.subcategory.name}</p>
                        <h2>{group.products.length} bundle offer{group.products.length === 1 ? "" : "s"}</h2>
                      </div>
                      <span className="storefront-subcategory-hint">Bundle products only</span>
                    </div>
                    <div className="product-grid storefront-product-grid">
                      {group.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ) : null}

          {bundleFileSections.length > 0 ? (
            <section className="section-block storefront-group-shell" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Files inside bundles</p>
                  <h2>Single-file products that belong to larger bundle collections.</h2>
                </div>
                <span className="storefront-subcategory-hint">Organized by subcategory</span>
              </div>
              <div className="subcategory-section-list storefront-group-list">
                {bundleFileSections.map((group) => (
                  <section className="subcategory-section storefront-group-section" id={group.subcategory.slug} key={`bundle-files-${group.subcategory.slug}`}>
                    <div className="section-heading storefront-section-heading">
                      <div>
                        <p className="eyebrow eyebrow--electric">{group.subcategory.name}</p>
                        <h2>{group.products.length} bundle file{group.products.length === 1 ? "" : "s"}</h2>
                      </div>
                      <span className="storefront-subcategory-hint">Included in one or more bundles</span>
                    </div>
                    <div className="product-grid storefront-product-grid">
                      {group.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ) : null}

          {standaloneSections.length > 0 ? (
            <section className="section-block storefront-group-shell" data-reveal>
              <div className="section-heading storefront-section-heading">
                <div>
                  <p className="eyebrow eyebrow--electric">Standalone files</p>
                  <h2>Independent products that are not part of any bundle.</h2>
                </div>
                <span className="storefront-subcategory-hint">Separate from bundle ecosystems</span>
              </div>
              <div className="subcategory-section-list storefront-group-list">
                {standaloneSections.map((group) => (
                  <section className="subcategory-section storefront-group-section" id={`standalone-${group.subcategory.slug}`} key={`standalone-${group.subcategory.slug}`}>
                    <div className="section-heading storefront-section-heading">
                      <div>
                        <p className="eyebrow eyebrow--electric">{group.subcategory.name}</p>
                        <h2>{group.products.length} standalone file{group.products.length === 1 ? "" : "s"}</h2>
                      </div>
                      <span className="storefront-subcategory-hint">Not included in any bundle</span>
                    </div>
                    <div className="product-grid storefront-product-grid">
                      {group.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
