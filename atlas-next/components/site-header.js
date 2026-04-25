"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isNearTop = currentScrollY < 96;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      const hasPassedThreshold = currentScrollY > 160;

      if (isNearTop || !hasPassedThreshold || !isScrollingDown) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header${isHidden ? " is-hidden" : ""}`}>
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
    </header>
  );
}
