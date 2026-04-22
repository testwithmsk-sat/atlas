import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { fallbackProducts } from "@/lib/products";

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
