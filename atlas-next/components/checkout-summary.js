"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { formatUsdAmount } from "@/lib/currency";

export function CheckoutSummary() {
  const { items, itemCount, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <article className="summary-card">
        <p className="eyebrow">Your Order</p>
        <h2>Your cart is empty.</h2>
        <p>Add wedding templates before starting checkout.</p>
        <div className="summary-actions">
          <Link className="button button-secondary" href="/shop">
            Browse Products
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
      </div>
      <p>Use Razorpay to complete payment for the current offer prices shown across the wedding collection.</p>
      <CheckoutButton />
    </article>
  );
}
