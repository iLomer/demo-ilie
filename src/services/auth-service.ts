import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Auth business logic. Depends on a Supabase client (injected) so it can be
 * unit-tested without a live connection.
 */

export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

export async function isAuthenticated(client: SupabaseClient): Promise<boolean> {
  const user = await getCurrentUser(client);
  return user !== null;
}

/**
 * Resolves the display name for a user, falling back to the email address
 * and finally to a generic label when neither is present.
 */
export function getDisplayName(user: User): string {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim();
  }
  if (user.email) {
    return user.email;
  }
  return "there";
}
