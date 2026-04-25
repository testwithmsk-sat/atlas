"use client";

import Link from "next/link";

const primaryLinks = [
  { href: "/shop", label: "Store Status" },
  { href: "/categories", label: "Categories" },
  { href: "/account", label: "Account" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/">
        <span className="brand-title">The Digital Atlas</span>
        <span className="brand-subtitle">Storefront currently empty</span>
      </Link>

      <nav className="primary-nav" aria-label="Primary">
        {primaryLinks.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <Link className="button button-primary" href="/account">
          Account
        </Link>
      </div>
    </header>
  );
}
