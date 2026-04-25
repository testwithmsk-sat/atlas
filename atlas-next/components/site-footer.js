import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>The website is currently empty and no previews are being shown.</p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Status</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/account">Account</Link>
      </div>
    </footer>
  );
}
