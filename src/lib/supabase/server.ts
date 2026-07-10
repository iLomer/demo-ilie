import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getConfig } from "@/lib/config";

type CookiesToSet = Parameters<SetAllCookies>[0];

/**
 * Creates a Supabase client for use in server components, server actions
 * and route handlers. Reads and writes auth cookies via the Next.js
 * cookie store.
 */
export function createClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getConfig().supabase;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored when middleware refreshes the session.
        }
      },
    },
  });
}
