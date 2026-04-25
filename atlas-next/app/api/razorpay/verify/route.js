import { NextResponse } from "next/server";
import { finalizeCheckoutOrder } from "@/lib/orders";
import { fetchRazorpayPayment, verifyRazorpaySignature } from "@/lib/razorpay";
import { hasRazorpayConfig } from "@/lib/env";

export async function POST(request) {
  try {
    if (!hasRazorpayConfig) {
      return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 });
    }

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    } = await request.json();

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
