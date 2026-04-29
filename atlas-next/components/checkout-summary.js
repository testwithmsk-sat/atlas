"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { formatUsdAmount } from "@/lib/currency";

export function CheckoutSummary({ hasRazorpayConfig = false }) {
  const { items, itemCount, subtotal } = useCart();
  const bundleCount = items.filter((item) => item.kind === "generated_bundle" || item.isBundle === true).length;

  if (items.length === 0) {
    return (
      <article className="summary-card">
        <p className="eyebrow">Your Order</p>
        <h2>Your cart is empty.</h2>
        <p>Add a generated premium bundle from the AI workspace before starting checkout.</p>
        <div className="summary-actions">
          <Link className="button button-secondary" href="/">
            Start The Planner
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="summary-card">
      <p className="eyebrow">Your Order</p>
      <h2>{itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout</h2>
      <div className="summary-lines">
        <div>
          <span>Subtotal</span>
          <strong>{formatUsdAmount(subtotal)}</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>Digital download</strong>
        </div>
        <div>
          <span>Offer pricing</span>
          <strong>Applied</strong>
        </div>
        <div>
          <span>Bundles in cart</span>
          <strong>{bundleCount}</strong>
        </div>
      </div>
      <p>Use Razorpay to unlock the full generated bundle tied to your AI workspace session.</p>
      <div className="checkout-microcopy">
        <span>Secure Razorpay payment</span>
        <span>Instant digital delivery</span>
        <span>Account library access</span>
      </div>
      {!hasRazorpayConfig ? (
        <p className="status-note">
          Checkout is currently disabled because Razorpay keys are missing from this environment.
        </p>
      ) : null}
      <CheckoutButton hasRazorpayConfig={hasRazorpayConfig} />
    </article>
  );
}
