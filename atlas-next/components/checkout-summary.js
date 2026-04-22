"use client";

import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";

export function CheckoutSummary() {
  const { itemCount, subtotal } = useCart();

  return (
    <article className="summary-card">
      <p className="eyebrow">Recommended stack</p>
      <h2>Next.js + Stripe + Supabase</h2>
      <div className="summary-lines">
        <div>
          <span>Items in cart</span>
          <strong>{itemCount}</strong>
        </div>
        <div>
          <span>Current subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
      </div>
      <p>This structure is already prepared for that full upgrade path.</p>
      <CheckoutButton />
    </article>
  );
}
