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
        <h1>Your generated bundle checkout cart.</h1>
        <p>Review the premium bundle tied to your AI workspace, then continue to checkout when you are ready.</p>
      </div>

      {items.length === 0 ? (
        <article className="info-card">
          <p className="eyebrow">Empty Cart</p>
          <h2>No generated bundles have been added yet.</h2>
          <p>Start with the AI workspace to generate a free sample and unlock the full paid bundle when the direction feels right.</p>
          <Link className="button button-primary" href="/">
            Start The Planner
          </Link>
        </article>
      ) : (
        <div className="cart-layout">
          <div className="stack">
            {items.map((item) => (
              <article className="cart-item" key={item.kind === "generated_bundle" ? item.sessionId : item.slug}>
                <img src={item.image || "/the-digital-atlas-logo-black-gold.svg"} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.priceLabel} {item.kind === "generated_bundle" ? "for this session" : "each"}</p>
                  <div className="quantity-row">
                    {item.kind === "generated_bundle" ? <span>One session bundle</span> : (
                      <>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>
                          -
                        </button>
                        <span>Qty {item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>
                          +
                        </button>
                      </>
                    )}
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => removeItem(item.kind === "generated_bundle" ? item.sessionId : item.slug)}
                    >
                      Remove
                    </button>
                  </div>
                  {item.kind === "generated_bundle" && item.includedFormats?.length ? (
                    <p>{item.includedFormats.join(" + ")} full-bundle formats</p>
                  ) : null}
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
              <Link className="button button-secondary" href="/">
                Back To Planner
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
