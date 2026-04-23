"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { categoryDirectory } from "@/lib/catalog-taxonomy";

const primaryLinks = [
  { href: "/shop", label: "Shop", isDropdown: true },
  { href: "/categories", label: "Categories" },
  { href: "/shop", label: "Bundles" },
  { href: "/shop", label: "Best Sellers" },
  { href: "/account", label: "Account" }
];

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span className="brand-title">The Digital Atlas</span>
        <span className="brand-subtitle">Digital products for modern customers</span>
      </Link>

      <nav className="primary-nav" aria-label="Primary">
        {primaryLinks.map((link) => (
          link.isDropdown ? (
            <div className="nav-dropdown" key={link.label}>
              <Link className="nav-dropdown-trigger" href={link.href} aria-haspopup="true">
                {link.label}
              </Link>
              <div className="nav-dropdown-menu" role="menu" aria-label="Shop categories">
                {categoryDirectory.map((category) => (
                  <Link key={category.slug} href={`/shop/${category.slug}`} role="menuitem">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </Link>
          )
        ))}
      </nav>

      <div className="header-actions">
        <Link className="nav-pill" href="/shop">
          Search
        </Link>
        <Link className="nav-pill nav-pill--cart" href="/cart">
          Cart
          <span>{itemCount}</span>
        </Link>
        <Link className="button button-primary" href="/checkout">
          Checkout
        </Link>
      </div>
    </header>
  );
}
