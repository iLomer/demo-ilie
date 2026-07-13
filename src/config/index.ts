/**
 * Central configuration module.
 *
 * This is the ONLY place in the codebase that reads from `process.env`.
 * Everything else must import from here so environment access stays
 * validated and consistent.
 */

export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appUrl: string;
}

function readEnv(name: string): string {
  // Next.js inlines `NEXT_PUBLIC_*` values at build time, so this must
  // reference each variable statically rather than via a computed key.
  const values: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };

  return values[name] ?? '';
}

export function getConfig(): AppConfig {
  return {
    supabaseUrl: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    appUrl: readEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',
  };
}
