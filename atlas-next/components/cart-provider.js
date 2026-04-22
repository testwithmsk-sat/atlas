"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "tda-next-cart";

const CartContext = createContext(null);

const parsePrice = (label) => {
  const value = Number(label.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo(() => {
    const addItem = (product) => {
      setItems((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        if (existing) {
          return current.map((item) =>
            item.slug === product.slug
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...current,
          {
            slug: product.slug,
            name: product.name,
            image: product.image,
            priceLabel: product.priceLabel,
            priceValue: parsePrice(product.priceLabel),
            status: product.status,
            isPurchasable: product.isPurchasable !== false,
            quantity: 1
          }
        ];
      });
    };

    const updateQuantity = (slug, nextQuantity) => {
      setItems((current) =>
        current
          .map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(0, nextQuantity) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    };

    const removeItem = (slug) => {
      setItems((current) => current.filter((item) => item.slug !== slug));
    };

    const clearCart = () => {
      setItems([]);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);

    return {
      items,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal
    };
  }, [hydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
