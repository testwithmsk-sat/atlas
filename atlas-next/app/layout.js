import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "The Digital Atlas",
  description: "A future-ready ecommerce app for digital products, bundles, and in-site checkout."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
