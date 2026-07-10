import type { SupabaseClient } from "@supabase/supabase-js";

export interface LoginInput {
  email: string;
  password: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof LoginInput, string>>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates login credentials at the application boundary. Pure business logic,
 * no I/O — safe to unit test.
 */
export function validateLoginInput(input: LoginInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const email = input.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!input.password) {
    errors.password = "Password is required.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export interface SignInResult {
  success: boolean;
  error?: string;
}

/**
 * Signs a user in with email and password via Supabase Auth. Input is validated
 * before any network call is made.
 */
export async function signInWithPassword(
  client: SupabaseClient,
  input: LoginInput,
): Promise<SignInResult> {
  const { valid, errors } = validateLoginInput(input);
  if (!valid) {
    return { success: false, error: errors.email ?? errors.password };
  }

  const { error } = await client.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
