import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>Wedding spreadsheets, printable PDFs, signage, and bundle offers designed for a premium digital planning shop.</p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/bundles">Bundles</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
      </div>
    </footer>
  );
}
