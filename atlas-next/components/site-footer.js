import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>Digital templates, printable products, and creative bundles for weddings, celebrations, and modern businesses.</p>
      </div>
      <div className="footer-links">
        <Link href="/shop">Shop</Link>
        <Link href="/bundles">Bundles</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
        <Link href="/checkout">Checkout</Link>
      </div>
    </footer>
  );
}
