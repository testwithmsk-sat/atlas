import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" data-reveal>
      <div>
        <h2>The Digital Atlas</h2>
        <p>
          Describe your goal and get a focused digital product — free starter sample first,
          premium editable bundle when you're ready.
        </p>
        <p style={{ marginTop: "10px", fontSize: "0.82rem", opacity: 0.7 }}>
          Founded &amp; built by <strong>Sathiskumar</strong>
        </p>
      </div>
      <div className="footer-links">
        <Link href="/creator">AI Creator</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}
