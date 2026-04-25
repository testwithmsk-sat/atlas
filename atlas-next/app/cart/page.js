"use client";

import Link from "next/link";
import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { formatUsdAmount } from "@/lib/currency";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const hasRazorpayConfig = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Cart</p>
        <h1>Your wedding template cart.</h1>
        <p>Review your selected templates, adjust quantities, and continue to checkout when you are ready.</p>
      </div>

      {items.length === 0 ? (
        <article className="info-card">
          <p className="eyebrow">Empty Cart</p>
          <h2>No products have been added yet.</h2>
          <p>Browse the wedding collection to add the bundle or any individual editable PDF templates.</p>
          <Link className="button button-primary" href="/shop">
            Browse Wedding Templates
          </Link>
        </article>
      ) : (
        <div className="cart-layout">
          <div className="stack">
            {items.map((item) => (
              <article className="cart-item" key={item.slug}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.priceLabel} each</p>
                  <div className="quantity-row">
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>
                      -
                    </button>
                    <span>Qty {item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>
                      +
                    </button>
                    <button className="link-button" type="button" onClick={() => removeItem(item.slug)}>
                      Remove
                    </button>
                  </div>
                </div>
                <strong>{formatUsdAmount(item.priceValue * item.quantity)}</strong>
              </article>
            ))}
          </div>

          <article className="summary-card">
            <p className="eyebrow">Order Summary</p>
            <h2>{itemCount} item{itemCount === 1 ? "" : "s"} in cart</h2>
            <div className="summary-lines">
              <div>
                <span>Subtotal</span>
                <strong>{formatUsdAmount(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>Digital download</strong>
              </div>
            </div>
            <div className="summary-actions">
              <Link className="button button-secondary" href="/shop">
                Continue Shopping
              </Link>
              <Link className="button button-secondary" href="/checkout">
                Review Checkout
              </Link>
            </div>
            <CheckoutButton hasRazorpayConfig={hasRazorpayConfig} />
          </article>
        </div>
      )}
    </section>
  );
}
