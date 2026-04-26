import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Digital Atlas | Digital Templates, Planners, Bundles, and Printables",
    template: "%s | The Digital Atlas"
  },
  description:
    "Shop premium digital templates, planners, business documents, event kits, wedding printables, and bundle offers from The Digital Atlas.",
  keywords: [
    "digital templates",
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
    title: "The Digital Atlas | Digital Templates, Planners, Bundles, and Printables",
    description:
      "Shop premium digital templates, planners, business documents, event kits, wedding printables, and bundle offers from The Digital Atlas.",
    url: siteUrl,
    siteName: "The Digital Atlas",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Atlas | Digital Templates, Planners, Bundles, and Printables",
    description:
      "Shop premium digital templates, planners, business documents, event kits, wedding printables, and bundle offers from The Digital Atlas."
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
    description:
      "A digital storefront for premium templates, planners, business documents, event kits, and printable resources."
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
