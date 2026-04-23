"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Failed to load Razorpay."));
    document.body.appendChild(script);
  });
}

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

      const Razorpay = await loadRazorpayScript();
      const razorpay = new Razorpay({
        key: payload.key,
        amount: payload.amount,
        currency: payload.currency,
        name: payload.name,
        description: payload.description,
        order_id: payload.orderId,
        handler: async (paymentResult) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentResult)
          });

          const verifyPayload = await verifyResponse.json();
          if (!verifyResponse.ok) {
            setStatus(verifyPayload.error || "Payment verification failed.");
            return;
          }

          window.location.href = verifyPayload.redirectUrl || "/checkout/success";
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus("Checkout was cancelled. Your cart is still available.");
          }
        },
        theme: {
          color: "#b8891e"
        }
      });

      razorpay.open();
    } catch {
      setStatus("Something went wrong while starting Razorpay checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-launch">
      <button className="button button-primary" type="button" onClick={handleCheckout} disabled={loading}>
        {loading ? "Starting Checkout..." : "Pay With Razorpay"}
      </button>
      {status ? <p className="status-note">{status}</p> : null}
    </div>
  );
}
