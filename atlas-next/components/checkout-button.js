"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function CheckoutButton() {
  const { items } = useCart();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setStatus("Add products to the cart first.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });

      const payload = await response.json();

      if (!response.ok) {
        setStatus(payload.error || "Checkout is not ready yet.");
        return;
      }

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      setStatus(payload.message || "Checkout session created.");
    } catch {
      setStatus("Something went wrong while starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-launch">
      <button className="button button-primary" type="button" onClick={handleCheckout} disabled={loading}>
        {loading ? "Starting Checkout..." : "Start Stripe Checkout"}
      </button>
      {status ? <p className="status-note">{status}</p> : null}
    </div>
  );
}
