export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function toJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
