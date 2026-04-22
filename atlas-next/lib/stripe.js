import Stripe from "stripe";
import { env, hasStripeConfig } from "@/lib/env";

let stripeClient;

export function getStripe() {
  if (!hasStripeConfig) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey);
  }
  return stripeClient;
}
