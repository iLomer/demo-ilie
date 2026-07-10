"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithPassword } from "@/services/auth-service";

export interface LoginFormState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = createClient();
  const result = await signInWithPassword(supabase, { email, password });

  if (!result.success) {
    return { error: result.error ?? "Unable to sign in." };
  }

  redirect("/");
}
