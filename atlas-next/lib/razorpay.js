import crypto from "crypto";
import { env, hasRazorpayConfig } from "@/lib/env";

const RAZORPAY_API_BASE_URL = "https://api.razorpay.com/v1";

function getRazorpayAuthHeader() {
  const token = Buffer.from(`${env.razorpayKeyId}:${env.razorpayKeySecret}`).toString("base64");
  return `Basic ${token}`;
}

async function readRazorpayResponse(response, action) {
  const rawText = await response.text();
  let payload = null;

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const detail =
      payload?.error?.description ||
      payload?.description ||
      payload?.message ||
      rawText ||
      `Unable to ${action}.`;

    throw new Error(`Failed to ${action}: ${detail}`);
  }

  return payload;
}

export async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  if (!hasRazorpayConfig) return null;
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Razorpay order amount must be greater than zero.");
  }

  const response = await fetch(`${RAZORPAY_API_BASE_URL}/orders`, {
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

  return readRazorpayResponse(response, "create the Razorpay order");
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const expectedSignature = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const receivedSignature = Buffer.from(String(signature || ""), "hex");

  if (receivedSignature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedSignature, receivedSignature);
}

export async function fetchRazorpayPayment(paymentId) {
  if (!hasRazorpayConfig) return null;

  const response = await fetch(`${RAZORPAY_API_BASE_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: getRazorpayAuthHeader()
    }
  });

  return readRazorpayResponse(response, "fetch the Razorpay payment");
}
