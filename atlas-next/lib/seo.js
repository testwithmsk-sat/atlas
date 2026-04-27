export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";
export const storePriceRangeLabel = "$1 to $5";
export const bundlePriceFloorLabel = "$10";
export const storePriceSnippet = `Affordable digital templates and planners from ${storePriceRangeLabel}, with bundles from ${bundlePriceFloorLabel}.`;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function toJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
