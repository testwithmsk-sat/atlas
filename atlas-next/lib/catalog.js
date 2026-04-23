import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { fallbackProducts } from "@/lib/products";
import { categoryDirectory, getCategoryBySlug, starterCatalogPlan } from "@/lib/catalog-taxonomy";

export function parsePriceLabel(label) {
  const value = Number(String(label || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
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
    priceLabel: row.price_label,
    status: row.status || "Digital download",
    productType: row.product_type || "Digital download",
    summary: row.summary,
    image: row.image || "/products/wedding-invitation-template-bundle.svg",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    isPurchasable: row.is_purchasable !== false
  };
}

export async function getAllProducts() {
  const client = getSupabaseAdmin();
  if (!client) return fallbackProducts;

  const { data, error } = await client
    .from("products")
    .select("slug, name, category, category_slug, subcategory, subcategory_slug, badge, price_label, status, product_type, summary, image, highlights, is_purchasable")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return fallbackProducts;

  const productMap = new Map(fallbackProducts.map((product) => [product.slug, product]));
  data.map(normalizeProduct).forEach((product) => {
    productMap.set(product.slug, product);
  });

  return Array.from(productMap.values());
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
    highlights: ["Planned category placeholder", "Not available for checkout yet"],
    isPurchasable: false,
    isPlaceholder: true
  };
}

export async function getCategoryDirectoryWithCounts() {
  const products = await getAllProducts();

  return categoryDirectory.map((category) => {
    const liveCount = products.filter((product) => product.categorySlug === category.slug).length;
    const plannedCount = starterCatalogPlan.filter(
      (entry) => entry.categorySlug === category.slug && !products.some((product) => product.slug === entry.slug)
    ).length;

    return {
      ...category,
      liveCount,
      plannedCount
    };
  });
}

export async function getCategoryPageData(categorySlug) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const liveProducts = await getProductsByCategorySlug(categorySlug);
  const liveSlugSet = new Set(liveProducts.map((product) => product.slug));
  const placeholderProducts = starterCatalogPlan
    .filter((entry) => entry.categorySlug === categorySlug && !liveSlugSet.has(entry.slug))
    .map((entry) => createPlaceholderProduct(entry, categorySlug, liveProducts));

  const subcategoryMap = new Map(
    category.subcategories.map((subcategory) => [
      subcategory.slug,
      {
        ...subcategory,
        items: [],
        liveCount: 0,
        plannedCount: 0
      }
    ])
  );

  const ensureSubcategoryGroup = (slug, name) => {
    if (!subcategoryMap.has(slug)) {
      subcategoryMap.set(slug, {
        slug,
        name,
        items: [],
        liveCount: 0,
        plannedCount: 0
      });
    }

    return subcategoryMap.get(slug);
  };

  liveProducts.forEach((product) => {
    const group = ensureSubcategoryGroup(product.subcategorySlug || "other", product.subcategory || "Other");
    group.items.push(product);
    group.liveCount += 1;
  });

  placeholderProducts.forEach((product) => {
    const group = ensureSubcategoryGroup(product.subcategorySlug || "other", product.subcategory || "Other");
    group.items.push(product);
    group.plannedCount += 1;
  });

  const groups = Array.from(subcategoryMap.values())
    .filter((group) => group.items.length > 0)
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => {
        if (left.isPlaceholder === right.isPlaceholder) {
          return left.name.localeCompare(right.name);
        }

        return left.isPlaceholder ? 1 : -1;
      })
    }));

  return {
    category,
    groups,
    liveCount: liveProducts.length,
    plannedCount: placeholderProducts.length
  };
}
