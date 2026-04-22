import { NextResponse } from "next/server";
import { getProductsBySlugs, parsePriceLabel } from "@/lib/catalog";
import { env, hasStripeConfig } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  const { items = [] } = await request.json();

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  if (!hasStripeConfig) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable real checkout." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe client is unavailable." }, { status: 500 });
  }

  const catalogProducts = await getProductsBySlugs(items.map((item) => item.slug));
  const productMap = new Map(catalogProducts.map((product) => [product.slug, product]));

  const lineItems = items.map((item) => {
    const product = productMap.get(item.slug);
    if (!product || product.isPurchasable === false) return null;

    const unitAmount = Math.round(parsePriceLabel(product.priceLabel) * 100);
    if (unitAmount <= 0) return null;

    return {
      quantity: Math.max(1, Number(item.quantity || 1)),
      price_data: {
        currency: "usd",
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          metadata: {
            slug: product.slug || ""
          }
        }
      }
    };
  });

  const validLineItems = lineItems.filter(Boolean);
  if (validLineItems.length === 0) {
    return NextResponse.json({ error: "No valid products were found for checkout." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    success_url: `${env.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.siteUrl}/checkout?status=cancelled`,
    allow_promotion_codes: true,
    line_items: validLineItems
  });

  return NextResponse.json({ url: session.url });
}
