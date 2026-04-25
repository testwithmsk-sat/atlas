"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bundles", label: "Bundles" },
  { href: "/categories", label: "Categories" },
  { href: "/best-sellers", label: "Best Sellers" }
];

function isPrimaryLinkActive(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href === "/shop") return pathname.startsWith("/shop") || pathname.startsWith("/products");
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-top">
        <Link className="brand-mark" href="/">
          <span className="brand-kicker">Curated Digital Atelier</span>
          <span className="brand-title-row">
            <span className="brand-title">The Digital Atlas</span>
            <span className="brand-monogram" aria-hidden="true">
              TDA
            </span>
          </span>
          <span className="brand-subtitle">Wedding templates, planners, and printables</span>
        </Link>

        <div className="header-utility-row">
          <div className="header-tools">
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
          </div>

          <div className="header-cta-group">
            <Link className="nav-pill nav-pill--cart" href="/cart">
              Cart
              <span>{itemCount}</span>
            </Link>
            <Link className="button button-primary" href="/account">
              Account
            </Link>
          </div>
        </div>
      </div>

      <div className="site-header-divider" aria-hidden="true"></div>

      <div className="site-header-bottom">
        <nav className="primary-nav" aria-label="Primary">
          {primaryLinks.map((link) => {
            const isActive = isPrimaryLinkActive(pathname, link.href);

            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
