import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>Editable wedding PDFs, bundle offers, and premium digital templates designed for easy customer personalization.</p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/bundles">Bundles</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
      </div>
    </footer>
  );
}
