import { getAllProducts } from "@/lib/catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export default async function sitemap() {
  const products = await getAllProducts();
  const productSlugs = products.map((product) => product.slug);
  const categorySlugs = [...new Set(products.map((product) => product.categorySlug).filter(Boolean))];

  const staticRoutes = [
    "",
    "/shop",
    "/bundles",
    "/categories",
    "/best-sellers",
    "/faq"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8
    })),
    ...categorySlugs.map((slug) => ({
      url: `${siteUrl}/shop/${slug}`,
      changeFrequency: "weekly",
      priority: 0.75
    })),
    ...productSlugs.map((slug) => ({
      url: `${siteUrl}/products/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7
    }))
  ];
}
