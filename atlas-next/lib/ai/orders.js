import { getSupabaseAdmin } from "@/lib/supabase-admin";

function getMemoryOrderStore() {
  if (!globalThis.__atlasGenerationOrders) {
    globalThis.__atlasGenerationOrders = new Map();
  }

  return globalThis.__atlasGenerationOrders;
}

function toOrder(order) {
  return {
    id: order.id || order.gatewayOrderId,
    sessionId: order.sessionId,
    gatewayOrderId: order.gatewayOrderId,
    customerEmail: String(order.customerEmail || "").trim().toLowerCase(),
    amountTotal: Number(order.amountTotal || 0),
    currency: String(order.currency || "INR").toUpperCase(),
    paymentStatus: order.paymentStatus || "pending",
    status: order.status || "pending",
    createdAt: order.createdAt || new Date().toISOString()
  };
}

function fromDatabaseRow(row) {
  if (!row?.gateway_order_id) return null;

  return toOrder({
    id: row.id,
    sessionId: row.session_id,
    gatewayOrderId: row.gateway_order_id,
    customerEmail: row.customer_email,
    amountTotal: row.amount_total,
    currency: row.currency,
    paymentStatus: row.payment_status,
    status: row.status,
    createdAt: row.created_at
  });
}

export async function createGeneratedCheckoutOrder({ sessionId, gatewayOrderId, customerEmail, amountTotal, currency }) {
  const order = toOrder({
    sessionId,
    gatewayOrderId,
    customerEmail,
    amountTotal,
    currency,
    paymentStatus: "pending",
    status: "pending"
  });
  getMemoryOrderStore().set(order.gatewayOrderId, order);

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, order };

  const { error } = await supabase.from("generation_orders").upsert(
    {
      session_id: order.sessionId,
      gateway_order_id: order.gatewayOrderId,
      customer_email: order.customerEmail,
      amount_total: order.amountTotal,
      currency: order.currency,
      payment_status: order.paymentStatus,
      status: order.status
    },
    { onConflict: "gateway_order_id" }
  );

  return { ok: !error, error, order };
}

export async function finalizeGeneratedCheckoutOrder({
  gatewayOrderId,
  customerEmail,
  amountTotal,
  currency,
  paymentStatus = "paid"
}) {
  const normalizedEmail = String(customerEmail || "").trim().toLowerCase();
  const current = await getGenerationOrderByGatewayOrderId(gatewayOrderId);
  if (!current) return { ok: false, reason: "order-not-found" };

  const nextOrder = toOrder({
    ...current,
    customerEmail: normalizedEmail || current.customerEmail,
    amountTotal,
    currency,
    paymentStatus,
    status: paymentStatus === "paid" || paymentStatus === "captured" ? "paid" : "pending"
  });
  getMemoryOrderStore().set(nextOrder.gatewayOrderId, nextOrder);

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: true, order: nextOrder };

  const { error } = await supabase
    .from("generation_orders")
    .update({
      customer_email: nextOrder.customerEmail,
      amount_total: nextOrder.amountTotal,
      currency: nextOrder.currency,
      payment_status: nextOrder.paymentStatus,
      status: nextOrder.status
    })
    .eq("gateway_order_id", gatewayOrderId);

  return { ok: !error, error, order: nextOrder };
}

export async function getGenerationOrderByGatewayOrderId(gatewayOrderId) {
  if (!gatewayOrderId) return null;
  const memoryMatch = getMemoryOrderStore().get(gatewayOrderId);
  if (memoryMatch) return memoryMatch;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("generation_orders")
    .select("id, session_id, gateway_order_id, customer_email, amount_total, currency, payment_status, status, created_at")
    .eq("gateway_order_id", gatewayOrderId)
    .single();

  if (error || !data) return null;

  const order = fromDatabaseRow(data);
  if (order) {
    getMemoryOrderStore().set(order.gatewayOrderId, order);
  }
  return order;
}

export async function listGenerationOrdersForCustomer(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return [];

  const memoryMatches = [...getMemoryOrderStore().values()].filter((order) => order.customerEmail === normalizedEmail);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return memoryMatches.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  const { data, error } = await supabase
    .from("generation_orders")
    .select("id, session_id, gateway_order_id, customer_email, amount_total, currency, payment_status, status, created_at")
    .eq("customer_email", normalizedEmail)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return memoryMatches.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  const orders = data.map(fromDatabaseRow).filter(Boolean);
  orders.forEach((order) => getMemoryOrderStore().set(order.gatewayOrderId, order));
  return orders;
}

export async function customerHasPaidBundleAccess(sessionId, email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!sessionId || !normalizedEmail) return false;

  const memoryPaidMatch = [...getMemoryOrderStore().values()].some(
    (order) => order.sessionId === sessionId && order.customerEmail === normalizedEmail && order.status === "paid"
  );
  if (memoryPaidMatch) return true;

  const supabase = getSupabaseAdmin();
  if (!supabase) return false;

  const { count, error } = await supabase
    .from("generation_orders")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId)
    .eq("customer_email", normalizedEmail)
    .eq("status", "paid");

  if (error) return false;
  return Boolean(count);
}
