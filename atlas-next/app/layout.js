import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteEffects } from "@/components/site-effects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, toJsonLd } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thedigitalatlas.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Digital Atlas | Intent-To-Product AI Workspace",
    template: "%s | The Digital Atlas"
  },
  description:
    "Describe a wedding, event, business, or life-planning goal and let The Digital Atlas turn it into a free sample and a paid editable bundle.",
  keywords: [
    "intent-to-product ai",
    "digital product planning ai",
    "wedding planning ai",
    "event planning ai",
    "business template ai",
    "life organization ai"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "The Digital Atlas | Intent-To-Product AI Workspace",
    description:
      "An AI-first layer that turns customer goals into free starter samples and premium editable bundle downloads.",
    url: siteUrl,
    siteName: "The Digital Atlas",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Atlas | Intent-To-Product AI Workspace",
    description:
      "An AI-first layer that turns customer goals into free starter samples and premium editable bundle downloads."
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
      target: `${siteUrl}/?prompt={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Digital Atlas",
    url: siteUrl,
    logo: absoluteUrl("/the-digital-atlas-logo-black-gold.svg"),
    description: "An AI-first planning layer for digital products that helps customers describe a goal, receive a free sample, and unlock the right editable downloads."
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
