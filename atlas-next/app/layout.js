import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
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
