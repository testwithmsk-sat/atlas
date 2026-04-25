import { NextResponse } from "next/server";
import { finalizeCheckoutOrder } from "@/lib/orders";
import { fetchRazorpayPayment, verifyRazorpaySignature } from "@/lib/razorpay";
import { hasRazorpayConfig } from "@/lib/env";

export async function POST(request) {
  try {
    if (!hasRazorpayConfig) {
      return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 });
    }

    const payload = await request.json().catch(() => ({}));
    const paymentResult =
      payload?.paymentResult && typeof payload.paymentResult === "object" ? payload.paymentResult : payload;
    const orderId = paymentResult?.razorpay_order_id || paymentResult?.order_id || payload?.orderId || "";
    const paymentId = paymentResult?.razorpay_payment_id || paymentResult?.payment_id || payload?.paymentId || "";
    const signature =
      paymentResult?.razorpay_signature || paymentResult?.signature || payload?.razorpaySignature || "";

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing Razorpay payment details." }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Razorpay signature." }, { status: 400 });
    }

    const payment = await fetchRazorpayPayment(paymentId);
    if (!payment?.id) {
      return NextResponse.json({ error: "Razorpay payment details could not be loaded." }, { status: 502 });
    }

    if (payment.order_id && payment.order_id !== orderId) {
      return NextResponse.json({ error: "Razorpay payment does not match the current order." }, { status: 400 });
    }

    if (payment.status === "failed") {
      return NextResponse.json({ error: "Razorpay reported a failed payment." }, { status: 400 });
    }

    const finalizeResult = await finalizeCheckoutOrder({
      gatewayOrderId: orderId,
      customerEmail: payment.email || "",
      customerName: payment.notes?.customer_name || "",
      amountTotal: Number(payment.amount || 0) / 100,
      currency: payment.currency || "INR",
      paymentStatus: payment.status || "paid"
    });

    if (!finalizeResult.ok) {
      return NextResponse.json({ error: "Payment was verified but order sync failed." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      redirectUrl: `/checkout/success?payment_id=${encodeURIComponent(paymentId)}&order_id=${encodeURIComponent(orderId)}`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Payment verification failed."
      },
      { status: 500 }
    );
  }
}
