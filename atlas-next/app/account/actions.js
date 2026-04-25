"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function getFriendlyAuthMessage(error, fallbackMessage) {
  if (!error) return "";

  const code = String(error.code || error.error_code || "").toLowerCase();
  const message = String(error.message || "").toLowerCase();

  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "Too many signup emails were requested recently. Please wait a few minutes and try again.";
  }

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (code === "email_address_invalid" || message.includes("invalid email")) {
    return "Enter a valid email address and try again.";
  }

  if (message.includes("password")) {
    return "Choose a stronger password and try again.";
  }

  return fallbackMessage || error.message || "Something went wrong. Please try again.";
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost || headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");

  return host ? `${protocol}://${host}` : null;
}

export async function signInAction(_prevState, formData) {
  if (!hasSupabaseConfig) {
    return { message: "Sign in is not available yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "We could not start sign in right now." };

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      message: getFriendlyAuthMessage(error, "We couldn't sign you in with those details.")
    };
  }

  revalidatePath("/account");
  return { message: "Signed in successfully. Refreshing account data..." };
}

export async function signUpAction(_prevState, formData) {
  if (!hasSupabaseConfig) {
    return { message: "Account creation is not available yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "We could not start account creation right now." };

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return {
      message: getFriendlyAuthMessage(error, "We couldn't create your account right now.")
    };
  }

  return { message: "Account created. Check your email for any confirmation steps." };
}

export async function signInWithGoogleAction() {
  if (!hasSupabaseConfig) {
    redirect("/account?auth=unavailable");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/account?auth=error");
  }

  const origin = (await getRequestOrigin()) || "http://localhost:3000";
  const redirectTo = `${origin}/auth/callback?next=/account`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "select_account"
      }
    }
  });

  if (error || !data?.url) {
    redirect("/account?auth=google-error");
  }

  redirect(data.url);
}

export async function signOutAction() {
  if (!hasSupabaseConfig) {
    return { message: "Sign out is not available yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "We could not sign you out right now." };

  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      message: getFriendlyAuthMessage(error, "We couldn't sign you out right now.")
    };
  }

  revalidatePath("/account");
  return { message: "Signed out successfully." };
}
