"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout can only open in the browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

      const resolveCheckout = () => {
        if (typeof window.Razorpay === "function") {
          resolve(window.Razorpay);
          return;
        }

        reject(new Error("Razorpay checkout did not finish loading. Refresh the page and try again."));
      };

      const rejectCheckout = () => {
        razorpayScriptPromise = undefined;
        reject(new Error("Failed to load Razorpay checkout. Disable any blocker and try again."));
      };

      if (existing) {
        existing.addEventListener("load", resolveCheckout, { once: true });
        existing.addEventListener("error", rejectCheckout, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = resolveCheckout;
      script.onerror = rejectCheckout;
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

async function readJsonResponse(response, fallbackMessage) {
  const rawText = await response.text();
  let data = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error("Checkout returned an invalid response. Refresh the page and try again.");
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || fallbackMessage);
  }

  return data;
}

function getRazorpayErrorMessage(error) {
  if (!error) return "Razorpay could not complete the payment.";

  return (
    error.description ||
    error.reason ||
    error.step ||
    error.source ||
    error.message ||
    "Razorpay could not complete the payment."
  );
}

export function CheckoutButton({ hasRazorpayConfig = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) }) {
  const { items, clearCart, checkoutContact, updateCheckoutContact } = useCart();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(Boolean(typeof window !== "undefined" && window.Razorpay));
  const isVerifyingRef = useRef(false);
  const customerEmail = checkoutContact.email || "";
  const customerName = checkoutContact.name || "";
  const hasValidCustomerEmail = isValidEmail(customerEmail);

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
        "Razorpay checkout is disabled. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET to .env.local, then restart the dev server."
      );
      return;
    }

    if (items.length === 0) {
      setStatus("Add products to the cart first.");
      return;
    }

    if (!hasValidCustomerEmail) {
      setStatus("Enter the email address that should receive this order before starting checkout.");
      return;
    }

    setLoading(true);
    setStatus("");
    isVerifyingRef.current = false;

    try {
      const [Razorpay, payload] = await Promise.all([
        loadRazorpayScript(),
        fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customer: {
              email: customerEmail,
              name: customerName
            }
          })
        }).then((response) => readJsonResponse(response, "Checkout is not ready yet."))
      ]);

      if (!payload?.orderId || !payload?.key) {
        setStatus("Checkout service returned an empty response. Refresh the page and try again.");
        return;
      }

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
        prefill: {
          email: customerEmail,
          name: customerName
        },
        handler: async (paymentResult) => {
          isVerifyingRef.current = true;
          setLoading(true);
          setStatus("Verifying payment...");

          try {
            const verifyPayload = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResult)
            }).then((response) => readJsonResponse(response, "Payment verification failed."));

            if (!verifyPayload?.redirectUrl) {
              throw new Error("Payment was captured, but the success redirect is missing.");
            }

            clearCart();
            window.location.assign(verifyPayload.redirectUrl);
          } catch (error) {
            isVerifyingRef.current = false;
            setLoading(false);
            setStatus(error instanceof Error ? error.message : "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            if (isVerifyingRef.current) return;
            setLoading(false);
            setStatus("Checkout was cancelled. Your cart is still available.");
          }
        },
        retry: {
          enabled: true
        },
        theme: {
          color: "#b8891e"
        }
      });

      razorpay.on("payment.failed", (event) => {
        isVerifyingRef.current = false;
        setLoading(false);
        setStatus(getRazorpayErrorMessage(event?.error));
      });

      razorpay.open();
      setLoading(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong while starting Razorpay checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-launch">
      <div className="auth-form checkout-contact-form">
        <label>
          <span>Delivery Email</span>
          <input
            name="checkout-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={customerEmail}
            onChange={(event) => updateCheckoutContact({ email: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Customer Name</span>
          <input
            name="checkout-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            value={customerName}
            onChange={(event) => updateCheckoutContact({ name: event.target.value })}
          />
        </label>
      </div>
      <p className="status-note">
        We use this email to attach your order, account library access, and download delivery to the right customer.
      </p>
      <button
        className="button button-primary"
        type="button"
        onClick={handleCheckout}
        disabled={loading || !hasRazorpayConfig || !hasValidCustomerEmail}
        aria-disabled={loading || !hasRazorpayConfig || !hasValidCustomerEmail}
      >
        {loading
          ? "Starting Checkout..."
          : hasRazorpayConfig
            ? scriptReady
              ? "Pay With Razorpay"
              : "Pay With Razorpay"
            : "Razorpay Not Configured"}
      </button>
      {status ? (
        <p className="status-note">{status}</p>
      ) : !hasRazorpayConfig ? (
        <p className="status-note">
          Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` to `.env.local` to enable checkout.
        </p>
      ) : !hasValidCustomerEmail ? (
        <p className="status-note">Enter a valid delivery email to continue to payment.</p>
      ) : null}
    </div>
  );
}
