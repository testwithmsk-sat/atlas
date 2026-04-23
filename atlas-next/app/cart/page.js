"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatInrAmount } from "@/lib/currency";

export default function CartPage() {
  const { items, hydrated, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  const totalLabel = formatInrAmount(subtotal);

  return (
    <section className="section-block">
      <div className="page-intro">
        <p className="eyebrow">Cart</p>
        <h1>Review your items before checkout.</h1>
        <p>Update quantities, remove products, and confirm your order total before you continue to payment.</p>
      </div>

      <div className="cart-layout">
        <div className="stack">
          {!hydrated ? <article className="info-card">Loading cart...</article> : null}
          {hydrated && items.length === 0 ? (
            <article className="info-card">
              <h2>Your cart is empty.</h2>
              <p>Browse the shop and add the products you want to purchase.</p>
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
              <strong>{formatInrAmount(item.priceValue * item.quantity)}</strong>
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
              <strong>Instant digital access</strong>
            </div>
          </div>
          <p>Your subtotal updates automatically as you edit the cart.</p>
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
