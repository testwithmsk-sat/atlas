import { fallbackProducts } from "@/lib/products";
import { categoryDirectory, getCategoryBySlug } from "@/lib/catalog-taxonomy";
import { parseNumericAmount } from "@/lib/currency";

export function parsePriceLabel(label) {
  return parseNumericAmount(label);
}

export async function getAllProducts() {
  return fallbackProducts;
}

export async function getFeaturedProducts() {
  return fallbackProducts.filter((product) => product.isFeatured).slice(0, 3);
}

export async function getProductBySlug(slug) {
  return fallbackProducts.find((product) => product.slug === slug) || null;
}

export async function getProductsBySlugs(slugs) {
  const slugSet = new Set((slugs || []).filter(Boolean));
  if (slugSet.size === 0) return [];
  return fallbackProducts.filter((product) => slugSet.has(product.slug));
}

export async function getProductsByCategorySlug(categorySlug) {
  if (!categorySlug) return [];
  return fallbackProducts.filter((product) => product.categorySlug === categorySlug);
}

export async function getBundleProducts() {
  return fallbackProducts.filter((product) => product.isBundle === true);
}

export async function getBestSellerProducts() {
  return fallbackProducts.filter((product) => product.isBestSeller === true || product.isBundle === true);
}

export async function getCategoryDirectoryWithCounts() {
  return categoryDirectory.map((category) => {
    const liveCount = fallbackProducts.filter((product) => product.categorySlug === category.slug).length;
    return {
      ...category,
      liveCount,
      plannedCount: 0
    };
  });
}

export async function getCategoryPageData(categorySlug) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const liveProducts = fallbackProducts.filter((product) => product.categorySlug === categorySlug);
  const groups = category.subcategories
    .map((subcategory) => ({
      subcategory,
      products: liveProducts.filter((product) => product.subcategorySlug === subcategory.slug)
    }))
    .filter((group) => group.products.length > 0);

  return {
    category,
    groups,
    liveCount: liveProducts.length,
    plannedCount: 0
  };
}

export function normalizeSearchQuery(query) {
  return typeof query === "string" ? query.trim().toLowerCase() : "";
}

function getSearchableProductText(product) {
  const detailIncludes = Array.isArray(product.details?.includes) ? product.details.includes.join(" ") : "";
  const bundleContents = Array.isArray(product.bundleContents) ? product.bundleContents.join(" ") : "";
  const highlights = Array.isArray(product.highlights) ? product.highlights.join(" ") : "";

  return [
    product.name,
    product.summary,
    product.badge,
    product.productType,
    product.category,
    product.subcategory,
    product.status,
    highlights,
    detailIncludes,
    bundleContents
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function searchProducts(products, query) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return products;

  return products.filter((product) => getSearchableProductText(product).includes(normalizedQuery));
}
