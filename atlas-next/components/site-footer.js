import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" data-reveal>
      <div>
        <h2>The Digital Atlas</h2>
        <p>
          An AI-first intent workspace that turns messy goals into focused digital directions, free starter samples,
          and premium editable bundles that are easier to act on.
        </p>
      </div>
      <div className="footer-links">
        <Link href="/">Workspace</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}
