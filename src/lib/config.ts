/**
 * Central configuration module.
 * All environment variable access goes through here — never read
 * `process.env` directly elsewhere in the codebase.
 */

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

interface AppConfig {
  supabase: SupabaseConfig;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getConfig(): AppConfig {
  return {
    supabase: {
      url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    },
  };
}
