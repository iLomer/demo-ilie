import { createBrowserClient } from '@supabase/ssr';

import { getConfig } from '@/config';

/**
 * Creates a browser-side Supabase client using only the public anon key.
 * No service-role key is ever referenced on the client (AC 16).
 */
export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
