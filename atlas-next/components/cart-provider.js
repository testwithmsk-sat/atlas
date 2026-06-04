"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { parseNumericAmount } from "@/lib/currency";
import { fallbackProducts } from "@/lib/products";

const CART_STORAGE_KEY = "tda-next-cart";
const CHECKOUT_CONTACT_STORAGE_KEY = "tda-next-checkout-contact";

const CartContext = createContext(null);
const validProductMap = new Map(fallbackProducts.map((product) => [product.slug, product]));

function sanitizeCartItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (item?.kind === "generated_bundle" || item?.sessionId) {
        const sessionId = typeof item?.sessionId === "string" ? item.sessionId : "";
        if (!sessionId) return null;

        return {
          kind: "generated_bundle",
          sessionId,
          sessionToken: typeof item?.sessionToken === "string" ? item.sessionToken : "",
          name: typeof item?.name === "string" ? item.name : "Generated Digital Bundle",
          image: typeof item?.image === "string" ? item.image : "",
          priceLabel: typeof item?.priceLabel === "string" ? item.priceLabel : "₹499",
          priceValue: Number(item?.priceValue || 499),
          status: typeof item?.status === "string" ? item.status : "AI-generated premium bundle",
          includedFormats: Array.isArray(item?.includedFormats) ? item.includedFormats : [],
          deliverables: Array.isArray(item?.deliverables) ? item.deliverables : [],
          quantity: 1
        };
      }

      if (!item?.slug) return null;

      const product = validProductMap.get(item.slug);
      if (!product || product.isPurchasable === false) return null;

      return {
        kind: "legacy_product",
        slug: product.slug,
        name: product.name,
        image: product.image,
        priceLabel: product.priceLabel,
        priceValue: parseNumericAmount(product.priceLabel),
        status: product.status,
        isBundle: product.isBundle === true,
        isPurchasable: product.isPurchasable !== false,
        quantity: Math.max(1, Number(item.quantity || 1))
      };
    })
    .filter(Boolean);
}

function sanitizeCheckoutContact(contact) {
  const email = typeof contact?.email === "string" ? contact.email.trim().toLowerCase() : "";
  const name = typeof contact?.name === "string" ? contact.name.trim() : "";

  return {
    email,
    name
  };
}

function getCartItemKey(item) {
  if (!item) return "";
  return item.kind === "generated_bundle" ? item.sessionId : item.slug;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [checkoutContact, setCheckoutContact] = useState({ email: "", name: "" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(sanitizeCartItems(JSON.parse(saved)));
      }

      const savedContact = window.localStorage.getItem(CHECKOUT_CONTACT_STORAGE_KEY);
      if (savedContact) {
        setCheckoutContact(sanitizeCheckoutContact(JSON.parse(savedContact)));
      }
    } catch {
      setItems([]);
      setCheckoutContact({ email: "", name: "" });
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.localStorage.setItem(CHECKOUT_CONTACT_STORAGE_KEY, JSON.stringify(checkoutContact));
  }, [checkoutContact, hydrated, items]);

  const value = useMemo(() => {
      const addItem = (product) => {
        if (product?.sessionId) {
          setItems((current) => [
            ...current.filter((item) => item.kind !== "generated_bundle"),
            {
              kind: "generated_bundle",
              sessionId: product.sessionId,
              name: product.name,
              image: product.image || "",
              priceLabel: product.priceLabel,
              priceValue: parseNumericAmount(product.priceLabel),
              status: product.status || "AI-generated premium bundle",
              includedFormats: product.includedFormats || [],
              deliverables: product.deliverables || [],
              quantity: 1
            }
          ]);
          return;
        }

        setItems((current) => {
        const normalizedCurrent = sanitizeCartItems(current);
        const existing = normalizedCurrent.find((item) => item.slug === product.slug);
        if (existing) {
          return normalizedCurrent.map((item) =>
            item.slug === product.slug
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...normalizedCurrent,
          {
            slug: product.slug,
            name: product.name,
            image: product.image,
            priceLabel: product.priceLabel,
            priceValue: parseNumericAmount(product.priceLabel),
            status: product.status,
            isBundle: product.isBundle === true,
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
            getCartItemKey(item) === slug
              ? { ...item, quantity: Math.max(0, nextQuantity) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    };

    const removeItem = (slug) => {
      setItems((current) => current.filter((item) => getCartItemKey(item) !== slug));
    };

    const clearCart = () => {
      setItems([]);
    };

    const updateCheckoutContact = (nextContact) => {
      setCheckoutContact((current) =>
        sanitizeCheckoutContact({
          ...current,
          ...nextContact
        })
      );
    };

        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
    const hasGeneratedBundle = items.some((item) => item.kind === "generated_bundle");

    return {
      items,
      checkoutContact,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      updateCheckoutContact,
      itemCount,
      subtotal,
      hasGeneratedBundle
    };
  }, [checkoutContact, hydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
