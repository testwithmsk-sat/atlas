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

export async function saveCompletedCheckout({ session, lineItems }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, reason: "supabase-admin-missing" };

  const orderPayload = {
    stripe_checkout_session_id: session.id,
    customer_email: session.customer_details?.email || session.customer_email || "",
    customer_name: session.customer_details?.name || "",
    amount_total: Number(session.amount_total || 0) / 100,
    currency: (session.currency || "usd").toUpperCase(),
    payment_status: session.payment_status || "unpaid",
    status: session.payment_status === "paid" ? "paid" : "pending"
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

  const items = (lineItems || []).map((item) => {
    const product = item.price?.product;
    const slug = typeof product === "object" && product?.metadata?.slug ? product.metadata.slug : "";
    const unitAmount = Number(item.price?.unit_amount || 0) / 100;

    return {
      order_id: orderRow.id,
      product_slug: slug,
      product_name: item.description || "Digital product",
      quantity: item.quantity || 1,
      unit_amount: unitAmount,
      line_total: unitAmount * Number(item.quantity || 1)
    };
  });

  if (items.length > 0) {
    const { error: itemError } = await supabase.from("order_items").insert(items);
    if (itemError) return { ok: false, reason: "order-item-insert-failed", error: itemError };
  }

  await supabase.from("customer_downloads").delete().eq("order_id", orderRow.id);

  if (orderPayload.status === "paid") {
    const productSlugs = [...new Set(items.map((item) => item.product_slug).filter(Boolean))];

    if (productSlugs.length > 0 && orderPayload.customer_email) {
      const { data: downloadFiles, error: downloadFilesError } = await supabase
        .from("download_files")
        .select("id, product_slug")
        .eq("is_active", true)
        .in("product_slug", productSlugs);

      if (downloadFilesError) {
        return { ok: false, reason: "download-file-query-failed", error: downloadFilesError };
      }

      const downloads = (downloadFiles || []).map((file) => ({
        order_id: orderRow.id,
        customer_email: orderPayload.customer_email,
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
  }

  return { ok: true, orderId: orderRow.id };
}
