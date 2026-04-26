import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>
          Premium digital templates, printable planners, business documents, and event-ready bundles designed to feel
          polished, useful, and easy to buy.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/bundles">Bundles</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
      </div>
    </footer>
  );
}
