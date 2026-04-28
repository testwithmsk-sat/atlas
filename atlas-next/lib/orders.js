import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { env } from "@/lib/env";

export async function getOrdersForCustomer(email) {
  if (!email) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_email, amount_total, currency, payment_status, status, created_at, order_items(product_name, product_slug, quantity, line_total)")
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getDownloadLibrary(email) {
  if (!email) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("customer_downloads")
    .select(
      "order_id, product_slug, granted_at, download_files(id, file_name, file_url, file_type, storage_bucket, storage_path, access_mode), orders!inner(id, status, created_at), products!inner(name)"
    )
    .eq("customer_email", email)
    .order("granted_at", { ascending: false });

  if (error || !data) return [];

  const downloads = await Promise.all(
    data.map(async (item) => {
      const file = item.download_files || {};
      const storageBucket = file.storage_bucket || env.supabaseDownloadsBucket;
      const accessMode = file.access_mode || "signed";
      let fileUrl = file.file_url || "";

      if (accessMode === "signed" && file.storage_path) {
        const signedUrlResult = await supabase.storage
          .from(storageBucket)
          .createSignedUrl(file.storage_path, env.supabaseSignedUrlExpiresIn);

        if (!signedUrlResult.error && signedUrlResult.data?.signedUrl) {
          fileUrl = signedUrlResult.data.signedUrl;
        } else {
          fileUrl = "";
        }
      }

      return {
        orderId: item.order_id,
        productSlug: item.product_slug,
        productName: item.products?.name || file.file_name || "Digital product",
        status: item.orders?.status || "paid",
        purchasedAt: item.orders?.created_at || item.granted_at,
        fileName: file.file_name || "",
        fileUrl,
        fileType: file.file_type || "download"
      };
    })
  );

  return downloads.filter((item) => item.fileUrl);
}

export async function getPurchasedProductSlugs(email) {
  if (!email) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase.from("customer_downloads").select("product_slug").eq("customer_email", email);

  if (error || !data) return [];

  return [...new Set(data.map((item) => item.product_slug).filter(Boolean))];
}

async function grantDownloadsForOrder({ supabase, orderId, customerEmail, status, items }) {
  await supabase.from("customer_downloads").delete().eq("order_id", orderId);

  if (status !== "paid") {
    return { ok: true };
  }

  const productSlugs = [...new Set((items || []).map((item) => item.product_slug).filter(Boolean))];

  if (productSlugs.length > 0 && customerEmail) {
    const { data: downloadFiles, error: downloadFilesError } = await supabase
      .from("download_files")
      .select("id, product_slug")
      .eq("is_active", true)
      .in("product_slug", productSlugs);

    if (downloadFilesError) {
      return { ok: false, reason: "download-file-query-failed", error: downloadFilesError };
    }

    const downloads = (downloadFiles || []).map((file) => ({
      order_id: orderId,
      customer_email: customerEmail,
      product_slug: file.product_slug,
      download_file_id: file.id
    }));

    if (downloads.length > 0) {
      const { error: downloadInsertError } = await supabase.from("customer_downloads").insert(downloads);
      if (downloadInsertError) {
        return { ok: false, reason: "download-grant-insert-failed", error: downloadInsertError };
      }
    }
  }

  return { ok: true };
}

export async function createPendingCheckoutOrder({
  gatewayOrderId,
  items,
  amountTotal,
  currency,
  customerEmail,
  customerName
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, reason: "supabase-admin-missing" };

  const orderPayload = {
    stripe_checkout_session_id: gatewayOrderId,
    customer_email: customerEmail || "",
    customer_name: customerName || "",
    amount_total: Number(amountTotal || 0),
    currency: String(currency || "INR").toUpperCase(),
    payment_status: "pending",
    status: "pending"
  };

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .upsert(orderPayload, { onConflict: "stripe_checkout_session_id" })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    return { ok: false, reason: "order-upsert-failed", error: orderError };
  }

  await supabase.from("order_items").delete().eq("order_id", orderRow.id);

  const orderItems = (items || []).map((item) => {
    const unitAmount = Number(item.unit_amount || 0);
    return {
      order_id: orderRow.id,
      product_slug: item.product_slug || "",
      product_name: item.product_name || "Digital product",
      quantity: item.quantity || 1,
      unit_amount: unitAmount,
      line_total: unitAmount * Number(item.quantity || 1)
    };
  });

  if (orderItems.length > 0) {
    const { error: itemError } = await supabase.from("order_items").insert(orderItems);
    if (itemError) return { ok: false, reason: "order-item-insert-failed", error: itemError };
  }

  return { ok: true, orderId: orderRow.id };
}

export async function finalizeCheckoutOrder({
  gatewayOrderId,
  customerEmail,
  customerName,
  amountTotal,
  currency,
  paymentStatus = "paid"
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, reason: "supabase-admin-missing" };

  const { data: existingOrder, error: existingOrderError } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name")
    .eq("stripe_checkout_session_id", gatewayOrderId)
    .single();

  if (existingOrderError || !existingOrder) {
    return { ok: false, reason: "order-fetch-failed", error: existingOrderError };
  }

  const resolvedCustomerEmail = customerEmail || existingOrder.customer_email || "";
  const resolvedCustomerName = customerName || existingOrder.customer_name || "";
  const status = paymentStatus === "paid" || paymentStatus === "captured" ? "paid" : "pending";
  const updatePayload = {
    customer_email: resolvedCustomerEmail,
    customer_name: resolvedCustomerName,
    amount_total: Number(amountTotal || 0),
    currency: String(currency || "INR").toUpperCase(),
    payment_status: paymentStatus,
    status
  };

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("stripe_checkout_session_id", gatewayOrderId)
    .select("id")
    .single();

  if (orderError || !orderRow) {
    return { ok: false, reason: "order-update-failed", error: orderError };
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_slug, quantity, unit_amount, line_total")
    .eq("order_id", orderRow.id);

  if (itemsError) {
    return { ok: false, reason: "order-items-fetch-failed", error: itemsError };
  }

  const grantResult = await grantDownloadsForOrder({
    supabase,
    orderId: orderRow.id,
    customerEmail: resolvedCustomerEmail,
    status,
    items: items || []
  });

  if (!grantResult.ok) return grantResult;

  return { ok: true, orderId: orderRow.id };
}
