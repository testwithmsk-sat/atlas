"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export default function CartPage() {
  const { items, hydrated, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const totalLabel = `$${subtotal.toFixed(2)}`;

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Cart</p>
        <h1>Cart foundation for the future in-site purchase flow.</h1>
        <p>
          This is the starter route where real add-to-cart state, discount codes, shipping-free digital checkout,
          and payment summary logic will live next.
        </p>
      </div>

      <div className="cart-layout">
        <div className="stack">
          {!hydrated ? <article className="info-card">Loading cart...</article> : null}
          {hydrated && items.length === 0 ? (
            <article className="info-card">
              <h2>Your cart is empty.</h2>
              <p>Start with the shop page, then add products here to continue toward native checkout.</p>
              <Link className="button button-primary" href="/shop">
                Browse Products
              </Link>
            </article>
          ) : null}
          {items.map((item) => (
            <article className="cart-item" key={item.slug}>
              <img src={item.image} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>{item.priceLabel} each</p>
                {item.isPurchasable === false ? <p className="status-note">This item is not purchasable yet.</p> : null}
                <div className="quantity-row">
                  <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>
                    +
                  </button>
                  <button
                    className="link-button"
                    type="button"
                    onClick={() => removeItem(item.slug)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <strong>${(item.priceValue * item.quantity).toFixed(2)}</strong>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <p className="eyebrow">Order Summary</p>
          <h2>Cart totals</h2>
          <div className="summary-lines">
            <div>
              <span>Items</span>
              <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
            </div>
            <div>
              <span>Subtotal</span>
              <strong>{totalLabel}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>Digital</strong>
            </div>
          </div>
          <p>Next step: connect this summary to Stripe, order creation, and download delivery after payment.</p>
          <div className="summary-actions">
            <Link className="button button-primary" href="/checkout">
              Continue To Checkout
            </Link>
            <button className="button button-secondary" type="button" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
          <Link className="text-link" href="/shop">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
