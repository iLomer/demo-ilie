import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "@/config/env";

/**
 * Creates a Supabase client for use in Server Components, Server Actions and
 * Route Handlers. Session state is persisted through the request cookies.
 */
export function createClient(): SupabaseClient {
  const cookieStore = cookies();
  const { url, anonKey } = getConfig().supabase;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
