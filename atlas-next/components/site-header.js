"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bundles", label: "Bundles" },
  { href: "/categories", label: "Categories" },
  { href: "/best-sellers", label: "Best Sellers" }
];

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span className="brand-title">The Digital Atlas</span>
        <span className="brand-subtitle">Editable wedding PDF templates</span>
      </Link>

      <nav className="primary-nav" aria-label="Primary">
        {primaryLinks.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="nav-pill nav-pill--cart" href="/cart">
          Cart
          <span>{itemCount}</span>
        </Link>
        <Link className="button button-primary" href="/account">
          Account
        </Link>
      </div>
    </header>
  );
}
