import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>The storefront is currently empty and no products or previews are being shown.</p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Store Status</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/account">Account</Link>
      </div>
    </footer>
  );
}
