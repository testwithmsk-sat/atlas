import { NextResponse } from "next/server";
import { ensureBundleAssets } from "@/lib/ai/assets";
import { createGeneratedCheckoutOrder } from "@/lib/ai/orders";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { getOrRecoverSession } from "@/lib/ai/session-recovery";
import { convertUsdToInr } from "@/lib/currency";
import { createRazorpayOrder } from "@/lib/razorpay";
import { env, hasRazorpayConfig } from "@/lib/env";

function normalizeCustomer(payload) {
  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name  = typeof payload?.name  === "string" ? payload.name.trim()  : "";
  return { email, name };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export async function POST(request) {
  try {
    const payload  = await request.json().catch(() => ({}));
    const items    = Array.isArray(payload?.items) ? payload.items : [];
    const customer = normalizeCustomer(payload?.customer);

    if (items.length !== 1) {
      return NextResponse.json({ error: "Phase 1 checkout supports one generated bundle at a time." }, { status: 400 });
    }

    if (!isValidEmail(customer.email)) {
      return NextResponse.json({ error: "Enter a valid delivery email before starting checkout." }, { status: 400 });
    }

    if (!hasRazorpayConfig) {
      return NextResponse.json(
        { error: "Razorpay is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET to enable checkout." },
        { status: 503 }
      );
    }

    const item         = items[0];
    const sessionId    = typeof item?.sessionId    === "string" ? item.sessionId    : "";
    const sessionToken = typeof item?.sessionToken === "string" ? item.sessionToken : "";

    // Recover session from token if DB lookup fails (handles cold starts)
    const session = await getOrRecoverSession(sessionId, sessionToken);
    if (!session) {
      return NextResponse.json({ error: "Bundle session not found. Please generate a new product and try again." }, { status: 404 });
    }

    await ensureBundleAssets(session);
    const offer           = getPaidBundleOffer(session.templateFamily);
    const checkoutCurrency = String(env.razorpayCurrency || "INR").toUpperCase();
    const checkoutAmount  = checkoutCurrency === "INR" ? convertUsdToInr(offer.amountUsd) : Number(offer.amountUsd || 0);
    const amount   = Math.round(checkoutAmount * 100);
    const receipt  = `tda_gen_${Date.now()}`;

    const razorpayOrder = await createRazorpayOrder({
      amount, receipt,
      notes: {
        source: "the-digital-atlas-generated",
        session_id: sessionId,
        customer_email: customer.email,
        customer_name: customer.name || "Customer"
      }
    });

    if (!razorpayOrder?.id) {
      return NextResponse.json({ error: "Razorpay did not return a valid order id." }, { status: 502 });
    }

    const pendingOrder = await createGeneratedCheckoutOrder({
      sessionId,
      gatewayOrderId: razorpayOrder.id,
      customerEmail: customer.email,
      amountTotal: checkoutAmount,
      currency: checkoutCurrency
    });

    if (!pendingOrder.ok) {
      return NextResponse.json({ error: "Unable to prepare your generated bundle for checkout." }, { status: 500 });
    }

    return NextResponse.json({
      key: env.razorpayPublicKeyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "The Digital Atlas",
      description: offer.bundleName,
      sessionId
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generated checkout could not be started." },
      { status: 500 }
    );
  }
}

function normalizeCustomer(payload) {
  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";

  return { email, name };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const customer = normalizeCustomer(payload?.customer);

    if (items.length !== 1) {
      return NextResponse.json({ error: "Phase 1 checkout supports one generated bundle at a time." }, { status: 400 });
    }

    if (!isValidEmail(customer.email)) {
      return NextResponse.json({ error: "Enter a valid delivery email before starting checkout." }, { status: 400 });
    }

    if (!hasRazorpayConfig) {
      return NextResponse.json(
        {
          error: "Razorpay is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET to enable checkout."
        },
        { status: 503 }
      );
    }

    const item = items[0];
    const sessionId = typeof item?.sessionId === "string" ? item.sessionId : "";
    const session = await getGenerationSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "This generated bundle session could not be found." }, { status: 404 });
    }

    await ensureBundleAssets(session);
    const offer = getPaidBundleOffer(session.templateFamily);
    const checkoutCurrency = String(env.razorpayCurrency || "INR").toUpperCase();
    const checkoutAmount = checkoutCurrency === "INR" ? convertUsdToInr(offer.amountUsd) : Number(offer.amountUsd || 0);
    const amount = Math.round(checkoutAmount * 100);
    const receipt = `tda_gen_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt,
      notes: {
        source: "the-digital-atlas-generated",
        session_id: sessionId,
        customer_email: customer.email,
        customer_name: customer.name || "Customer"
      }
    });

    if (!razorpayOrder?.id) {
      return NextResponse.json({ error: "Razorpay did not return a valid order id." }, { status: 502 });
    }

    const pendingOrder = await createGeneratedCheckoutOrder({
      sessionId,
      gatewayOrderId: razorpayOrder.id,
      customerEmail: customer.email,
      amountTotal: checkoutAmount,
      currency: checkoutCurrency
    });

    if (!pendingOrder.ok) {
      return NextResponse.json({ error: "Unable to prepare your generated bundle for checkout." }, { status: 500 });
    }

    return NextResponse.json({
      key: env.razorpayPublicKeyId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "The Digital Atlas",
      description: offer.bundleName,
      sessionId
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generated checkout could not be started."
      },
      { status: 500 }
    );
  }
}
