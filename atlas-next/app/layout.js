import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteEffects } from "@/components/site-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, bundlePriceFloorLabel, storePriceRangeLabel, storePriceSnippet, toJsonLd } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `The Digital Atlas | Digital Templates From ${storePriceRangeLabel}`,
    template: "%s | The Digital Atlas"
  },
  description:
    `Shop affordable digital templates, planners, wedding checklists, business documents, and printables from ${storePriceRangeLabel}, with bundle deals from ${bundlePriceFloorLabel}.`,
  keywords: [
    "digital templates",
    "digital templates $1 to $5",
    "cheap digital downloads",
    "affordable printables",
    "printable planners",
    "wedding templates",
    "business templates",
    "event printables",
    "digital downloads"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `The Digital Atlas | Digital Templates From ${storePriceRangeLabel}`,
    description:
      `Shop affordable digital templates, planners, wedding checklists, business documents, and printables from ${storePriceRangeLabel}, with bundle deals from ${bundlePriceFloorLabel}.`,
    url: siteUrl,
    siteName: "The Digital Atlas",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `The Digital Atlas | Digital Templates From ${storePriceRangeLabel}`,
    description:
      `Shop affordable digital templates, planners, wedding checklists, business documents, and printables from ${storePriceRangeLabel}, with bundle deals from ${bundlePriceFloorLabel}.`
  },
  verification: {
    google: "DYhZFvndEMpeNcDI8Hfh3Trx4iL0XXDPJIyBEuc2moc"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Digital Atlas",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Digital Atlas",
    url: siteUrl,
    logo: absoluteUrl("/the-digital-atlas-logo-black-gold.svg"),
    description: `A digital storefront for stylish, affordable templates, planners, checklists, and printable resources. ${storePriceSnippet}`
  };

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(organizationJsonLd) }}
        />
        <SiteEffects />
        <CartProvider>
          <div className="shell">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
