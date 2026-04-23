"use client";

import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { formatInrAmount } from "@/lib/currency";

export function CheckoutSummary() {
  const { itemCount, subtotal } = useCart();

  return (
    <article className="summary-card">
      <p className="eyebrow">Order Summary</p>
      <h2>Checkout total</h2>
      <div className="summary-lines">
        <div>
          <span>Items in cart</span>
          <strong>{itemCount}</strong>
        </div>
        <div>
          <span>Current subtotal</span>
          <strong>{formatInrAmount(subtotal)}</strong>
        </div>
      </div>
      <p>Complete your payment securely with Razorpay to confirm this order.</p>
      <CheckoutButton />
    </article>
  );
}
