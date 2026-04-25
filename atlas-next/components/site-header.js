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
        <span className="brand-subtitle">Wedding templates, planners, and printables</span>
      </Link>

      <nav className="primary-nav" aria-label="Primary">
        {primaryLinks.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <form className="site-search-form" action="/shop" role="search">
          <label className="site-search-field">
            <span className="site-search-label">Search products</span>
            <input
              className="site-search-input"
              type="search"
              name="q"
              placeholder="Search products"
              autoComplete="off"
            />
          </label>
          <button className="button button-secondary site-search-button" type="submit">
            Search
          </button>
        </form>
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
