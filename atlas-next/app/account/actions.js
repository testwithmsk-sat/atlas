"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseConfig } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function signInAction(_prevState, formData) {
  if (!hasSupabaseConfig) {
    return { message: "Supabase keys are not configured yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Supabase client could not be created." };

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { message: error.message };

  revalidatePath("/account");
  return { message: "Signed in successfully. Refreshing account data..." };
}

export async function signUpAction(_prevState, formData) {
  if (!hasSupabaseConfig) {
    return { message: "Supabase keys are not configured yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Supabase client could not be created." };

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return { message: error.message };

  return { message: "Account created. Check email confirmation settings in Supabase." };
}

export async function signOutAction() {
  if (!hasSupabaseConfig) {
    return { message: "Supabase keys are not configured yet." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Supabase client could not be created." };

  const { error } = await supabase.auth.signOut();
  if (error) return { message: error.message };

  revalidatePath("/account");
  return { message: "Signed out successfully." };
}
