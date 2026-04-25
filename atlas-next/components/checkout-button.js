"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

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

export function CheckoutButton({ hasRazorpayConfig = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) }) {
  const { items } = useCart();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(Boolean(typeof window !== "undefined" && window.Razorpay));

  useEffect(() => {
    if (!hasRazorpayConfig) return;

    let isMounted = true;

    loadRazorpayScript()
      .then((Razorpay) => {
        if (!isMounted) return;
        setScriptReady(typeof Razorpay === "function");
      })
      .catch(() => {
        if (!isMounted) return;
        setScriptReady(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hasRazorpayConfig]);

  const handleCheckout = async () => {
    if (!hasRazorpayConfig) {
      setStatus(
        "Razorpay checkout is disabled. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local, then restart the dev server."
      );
      return;
    }

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
      if (typeof Razorpay !== "function") {
        throw new Error("Razorpay checkout did not load. Disable any ad blocker and refresh the page.");
      }

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
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong while starting Razorpay checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-launch">
      <button
        className="button button-primary"
        type="button"
        onClick={handleCheckout}
        disabled={loading || !hasRazorpayConfig}
        aria-disabled={loading || !hasRazorpayConfig}
      >
        {loading
          ? "Starting Checkout..."
          : hasRazorpayConfig
            ? scriptReady
              ? "Pay With Razorpay"
              : "Loading Razorpay..."
            : "Razorpay Not Configured"}
      </button>
      {status ? (
        <p className="status-note">{status}</p>
      ) : !hasRazorpayConfig ? (
        <p className="status-note">
          Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local` to enable checkout.
        </p>
      ) : null}
    </div>
  );
}
