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
  const [isCondensed, setIsCondensed] = useState(false);
  const [isArcadeMode, setIsArcadeMode] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState(null);
  const navRef = useRef(null);
  const linkRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setIsCondensed(window.scrollY > 72);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const activeLink = Object.values(linkRefs.current).find((node) => node?.dataset.active === "true");
      const navNode = navRef.current;

      if (!activeLink || !navNode) {
        setIndicatorStyle(null);
        return;
      }

      setIndicatorStyle({
        width: `${activeLink.offsetWidth}px`,
        height: `${activeLink.offsetHeight}px`,
        transform: `translate(${activeLink.offsetLeft}px, ${activeLink.offsetTop}px)`
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dataset.uiMode = isArcadeMode ? "arcade" : "focus";
  }, [isArcadeMode]);

  return (
    <header className={`site-header${isCondensed ? " is-condensed" : ""}`}>
      <div className="site-header-top">
        <Link className="brand-mark" href="/">
          <span className="brand-kicker">Curated Digital Atelier</span>
          <span className="brand-title-row">
            <span className="brand-title">The Digital Atlas</span>
            <span className="brand-monogram" aria-hidden="true">
              TDA
            </span>
          </span>
          <span className="brand-subtitle">Digital templates, planners, bundles, and printables</span>
        </Link>

        <nav className="primary-nav" aria-label="Primary" ref={navRef}>
          <span
            className={`primary-nav-indicator${indicatorStyle ? " is-visible" : ""}`}
            style={indicatorStyle || undefined}
            aria-hidden="true"
          />
          {primaryLinks.map((link) => {
            const isActive = isPrimaryLinkActive(pathname, link.href);

            return (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                ref={(node) => {
                  if (!node) return;
                  linkRefs.current[link.href] = node;
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

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
          <button
            className={`header-mode-toggle${isArcadeMode ? " is-arcade" : ""}`}
            type="button"
            aria-pressed={isArcadeMode}
            onClick={() => setIsArcadeMode((current) => !current)}
          >
            <span className="header-mode-toggle-track">
              <span className="header-mode-toggle-thumb"></span>
            </span>
            <span className="header-mode-toggle-label">{isArcadeMode ? "Arcade" : "Focus"}</span>
          </button>
          <Link className={`nav-pill nav-pill--cart${itemCount > 0 ? " has-items" : ""}`} href="/cart">
            Cart
            <span>{itemCount}</span>
          </Link>
          <Link className="button button-primary" href="/account">
            Account
          </Link>
        </div>
      </div>
    </header>
  );
}
