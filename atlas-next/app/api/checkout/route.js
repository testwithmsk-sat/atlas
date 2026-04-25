import { NextResponse } from "next/server";
import { getProductsBySlugs, parsePriceLabel } from "@/lib/catalog";
import { convertUsdToInr } from "@/lib/currency";
import { createPendingCheckoutOrder } from "@/lib/orders";
import { createRazorpayOrder } from "@/lib/razorpay";
import { env, hasRazorpayConfig } from "@/lib/env";

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const items = Array.isArray(payload?.items) ? payload.items : [];

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    if (!hasRazorpayConfig) {
      return NextResponse.json(
        {
          error:
            "Razorpay is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET to enable checkout."
        },
        { status: 503 }
      );
    }

    const catalogProducts = await getProductsBySlugs(items.map((item) => item.slug));
    const productMap = new Map(catalogProducts.map((product) => [product.slug, product]));
    const checkoutCurrency = String(env.razorpayCurrency || "INR").toUpperCase();

    const lineItems = items.map((item) => {
      const product = productMap.get(item.slug);
      if (!product || product.isPurchasable === false) return null;

      const storefrontUnitAmount = parsePriceLabel(product.priceLabel);
      const checkoutUnitAmount = checkoutCurrency === "INR" ? convertUsdToInr(storefrontUnitAmount) : storefrontUnitAmount;
      if (checkoutUnitAmount <= 0) return null;

      return {
        product_slug: product.slug,
        product_name: product.name,
        quantity: Math.max(1, Number(item.quantity || 1)),
        unit_amount: checkoutUnitAmount
      };
    });

    const validLineItems = lineItems.filter(Boolean);
    if (validLineItems.length === 0) {
      return NextResponse.json({ error: "No valid products were found for checkout." }, { status: 400 });
    }

    const amount = validLineItems.reduce(
      (sum, item) => sum + Math.round(Number(item.unit_amount || 0) * 100) * Number(item.quantity || 1),
      0
    );

    const receipt = `atlas_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt,
      notes: {
        source: "the-digital-atlas",
        item_count: String(validLineItems.length)
      }
    });

    if (!razorpayOrder?.id) {
      return NextResponse.json({ error: "Razorpay did not return a valid order id." }, { status: 502 });
    }

    const pendingOrder = await createPendingCheckoutOrder({
      gatewayOrderId: razorpayOrder.id,
      items: validLineItems,
      amountTotal: amount / 100,
      currency: checkoutCurrency
    });

    if (!pendingOrder.ok) {
      return NextResponse.json({ error: "Unable to prepare your order for checkout." }, { status: 500 });
    }

    return NextResponse.json({
      key: env.razorpayPublicKeyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "The Digital Atlas",
      description: `${validLineItems.length} digital item${validLineItems.length === 1 ? "" : "s"}`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Checkout could not be started."
      },
      { status: 500 }
    );
  }
}
