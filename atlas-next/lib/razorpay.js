import crypto from "crypto";
import { env, hasRazorpayConfig } from "@/lib/env";

function getRazorpayAuthHeader() {
  const token = Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString("base64");
  return `Basic ${token}`;
}

export async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  if (!hasRazorpayConfig) return null;

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: getRazorpayAuthHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency: env.razorpayCurrency,
      receipt,
      notes
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create Razorpay order: ${errorBody}`);
  }

  return response.json();
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const digest = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return digest === signature;
}

export async function fetchRazorpayPayment(paymentId) {
  if (!hasRazorpayConfig) return null;

  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: getRazorpayAuthHeader()
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch Razorpay payment: ${errorBody}`);
  }

  return response.json();
}
