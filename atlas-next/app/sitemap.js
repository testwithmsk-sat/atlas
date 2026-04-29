const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export default async function sitemap() {
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/faq",
    "/guides",
    "/account"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8
    }))
  ];
}
