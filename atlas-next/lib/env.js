function readEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

const razorpayServerKeyId = readEnvValue(process.env.RAZORPAY_KEY_ID);
const razorpayPublicKeyId = readEnvValue(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) || razorpayServerKeyId;

export const env = {
  supabaseUrl: readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: readEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
  supabaseDownloadsBucket: readEnvValue(process.env.SUPABASE_DOWNLOADS_BUCKET) || "product-downloads",
  supabaseSignedUrlExpiresIn: Number(process.env.SUPABASE_SIGNED_URL_EXPIRES_IN || 900),
  razorpayPublicKeyId,
  razorpayKeyId: razorpayServerKeyId || razorpayPublicKeyId,
  razorpayKeySecret: readEnvValue(process.env.RAZORPAY_KEY_SECRET),
  razorpayCurrency: readEnvValue(process.env.RAZORPAY_CURRENCY) || "INR",
  siteUrl: readEnvValue(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000"
};

export const hasSupabaseConfig = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasSupabaseAdmin = Boolean(hasSupabaseConfig && env.supabaseServiceRoleKey);
export const hasRazorpayPublicConfig = Boolean(env.razorpayPublicKeyId);
export const hasRazorpayServerConfig = Boolean(env.razorpayKeyId && env.razorpayKeySecret);
export const hasRazorpayConfig = Boolean(hasRazorpayPublicConfig && hasRazorpayServerConfig);
