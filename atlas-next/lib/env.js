export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseDownloadsBucket: process.env.SUPABASE_DOWNLOADS_BUCKET || "product-downloads",
  supabaseSignedUrlExpiresIn: Number(process.env.SUPABASE_SIGNED_URL_EXPIRES_IN || 900),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasSupabaseAdmin = Boolean(hasSupabaseConfig && env.supabaseServiceRoleKey);
export const hasStripeConfig = Boolean(env.stripeSecretKey);
export const hasStripeWebhookConfig = Boolean(hasStripeConfig && env.stripeWebhookSecret);
