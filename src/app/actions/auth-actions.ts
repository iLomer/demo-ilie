"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface AuthResult {
  error: string | null;
}

/**
 * Signs a user in with email and password. On success the user is redirected
 * to the homepage; on failure an error message is returned to the caller.
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
