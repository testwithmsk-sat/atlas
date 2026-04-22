import Stripe from "stripe";
import { NextResponse } from "next/server";
import { env, hasStripeConfig, hasStripeWebhookConfig } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { saveCompletedCheckout } from "@/lib/orders";

export async function POST(request) {
  if (!hasStripeConfig || !hasStripeWebhookConfig) {
    return NextResponse.json({ error: "Stripe webhook is not configured yet." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event;

  try {
    event = Stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const stripe = getStripe();
    const session = event.data.object;

    const lineItems = stripe
      ? await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"]
        })
      : { data: [] };

    await saveCompletedCheckout({
      session,
      lineItems: lineItems.data
    });
  }

  return NextResponse.json({ received: true });
}
