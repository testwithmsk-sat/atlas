import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { fallbackProducts } from "@/lib/products";
import { categoryDirectory, getCategoryBySlug, starterCatalogPlan } from "@/lib/catalog-taxonomy";
import { normalizePriceLabel, parseNumericAmount } from "@/lib/currency";

export function parsePriceLabel(label) {
  return parseNumericAmount(label);
}

function normalizeProduct(row) {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    categorySlug: row.category_slug || "",
    subcategory: row.subcategory || "",
    subcategorySlug: row.subcategory_slug || "",
    badge: row.badge || "Featured",
    priceLabel: normalizePriceLabel(row.price_label),
    status: row.status || "Digital download",
    productType: row.product_type || "Digital download",
    summary: row.summary,
    image: row.image || "/products/wedding-invitation-template-bundle.svg",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    isPurchasable: row.is_purchasable !== false
  };
}

function compareProductsForListing(left, right) {
  const leftPurchasable = left.isPurchasable !== false;
  const rightPurchasable = right.isPurchasable !== false;

  if (leftPurchasable !== rightPurchasable) {
    return leftPurchasable ? -1 : 1;
  }

  return left.name.localeCompare(right.name);
}

export async function getAllProducts() {
  return [];
}

export async function getFeaturedProducts() {
  const products = await getAllProducts();
  return products.slice(0, 3);
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductsBySlugs(slugs) {
  const slugSet = new Set((slugs || []).filter(Boolean));
  if (slugSet.size === 0) return [];

  const products = await getAllProducts();
  return products.filter((product) => slugSet.has(product.slug));
}

export async function getProductsByCategorySlug(categorySlug) {
  if (!categorySlug) return [];

  const products = await getAllProducts();
  return products.filter((product) => product.categorySlug === categorySlug);
}

export async function getBundleProducts() {
  const products = await getAllProducts();
  return products.filter((product) => {
    if (product.isPurchasable === false) return false;
    return /(bundle|pack|suite|kit|library)/i.test(`${product.name} ${product.productType}`);
  });
}

export async function getBestSellerProducts() {
  const products = await getAllProducts();
  return products.filter((product) => {
    if (product.isPurchasable === false) return false;
    return /(best seller|favorite|essential|launch ready)/i.test(product.badge || "");
  });
}

function createPlaceholderProduct(entry, categorySlug, liveProducts) {
  const category = getCategoryBySlug(categorySlug);
  const subcategory = category?.subcategories.find((item) => item.slug === entry.subcategorySlug) || null;
  const fallbackImage =
    liveProducts.find((product) => product.categorySlug === categorySlug)?.image ||
    fallbackProducts.find((product) => product.categorySlug === categorySlug)?.image ||
    "/products/wedding-invitation-template-bundle.svg";

  return {
    slug: entry.slug,
    name: entry.name,
    category: category?.name || "",
    categorySlug,
    subcategory: subcategory?.name || "",
    subcategorySlug: entry.subcategorySlug,
    badge: "Planned",
    priceLabel: "Coming soon",
    status: "Coming soon",
    productType: entry.productType,
    summary: `${entry.productType} planned for the ${category?.name || "catalog"} collection.`,
    image: fallbackImage,
    highlights: ["Coming soon in this collection", "Not available for checkout yet"],
    isPurchasable: false,
    isPlaceholder: true
  };
}

export async function getCategoryDirectoryWithCounts() {
  return categoryDirectory.map((category) => {
    return {
      ...category,
      liveCount: 0,
      plannedCount: 0
    };
  });
}

export async function getCategoryPageData(categorySlug) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  return {
    category,
    groups: [],
    liveCount: 0,
    plannedCount: 0
  };
}
