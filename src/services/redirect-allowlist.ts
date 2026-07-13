/**
 * Redirect allowlisting for password-recovery emails.
 *
 * Supabase sends the recovery email with a `redirectTo` URL. To prevent
 * open-redirect / phishing abuse (AC 13) we only ever allow redirect
 * targets that live under this application's own origin.
 */

/**
 * Build a safe, absolute redirect URL for the given path, anchored to the
 * application's own base URL. The `path` is treated as a relative path only;
 * any attempt to supply an absolute URL to a different origin is ignored and
 * falls back to the app origin.
 */
export function buildRedirectUrl(baseUrl: string, path: string): string {
  const base = new URL(baseUrl);
  // Resolving `path` against the app origin guarantees the result stays on
  // this origin even if `path` contains protocol-relative or absolute forms.
  const resolved = new URL(path, base);
  resolved.protocol = base.protocol;
  resolved.host = base.host;
  return resolved.toString();
}

/**
 * Returns true only when `candidate` is an absolute URL whose origin exactly
 * matches the application's allowlisted origin.
 */
export function isAllowedRedirect(baseUrl: string, candidate: string): boolean {
  try {
    const base = new URL(baseUrl);
    const target = new URL(candidate);
    return target.origin === base.origin;
  } catch {
    return false;
  }
}
