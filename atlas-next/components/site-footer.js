import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>The Digital Atlas</h2>
        <p>Migration-ready ecommerce app foundation for products, cart, accounts, and native checkout.</p>
      </div>
      <div className="footer-links">
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
        <Link href="/checkout">Checkout</Link>
      </div>
    </footer>
  );
}
