import { createBrowserClient } from "@supabase/ssr";
import { getConfig } from "@/lib/config";

/**
 * Creates a Supabase client for use in client components.
 */
export function createClient() {
  const { url, anonKey } = getConfig().supabase;
  return createBrowserClient(url, anonKey);
}
