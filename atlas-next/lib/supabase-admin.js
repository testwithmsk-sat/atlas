import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseAdmin } from "@/lib/env";

let adminClient;

export function getSupabaseAdmin() {
  if (!hasSupabaseAdmin) return null;
  if (!adminClient) {
    adminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return adminClient;
}
