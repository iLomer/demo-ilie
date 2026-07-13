/**
 * Service layer for the unauthenticated password-reset flow.
 *
 * Wraps the Supabase Auth recovery calls behind small interfaces so the
 * business behaviour (generic responses, rate-limit handling, invalid-link
 * detection) can be unit-tested without a live Supabase connection.
 */

import { buildRedirectUrl } from '@/services/redirect-allowlist';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/services/password-validation';

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

/** Minimal surface of the Supabase auth client used to request a reset. */
export interface ResetRequestClient {
  resetPasswordForEmail(
    email: string,
    options: { redirectTo: string },
  ): Promise<{ error: AuthError | null }>;
}

/** Minimal surface of the Supabase auth client used to complete a reset. */
export interface ResetCompletionClient {
  updateUser(
    attributes: { password: string },
  ): Promise<{ error: AuthError | null }>;
}

export type RequestResetOutcome = 'sent' | 'rate_limited' | 'error';

export type CompleteResetOutcome = 'success' | 'invalid_input' | 'invalid_link' | 'error';

export interface CompleteResetResult {
  outcome: CompleteResetOutcome;
  fieldErrors?: {
    password?: string;
    confirmation?: string;
  };
}

/** Path on this app that Supabase should redirect recovery links to. */
export const RESET_CONFIRMATION_PATH = '/reset-password';

function isRateLimited(error: AuthError): boolean {
  if (error.status === 429) {
    return true;
  }
  const haystack = `${error.code ?? ''} ${error.message}`.toLowerCase();
  return haystack.includes('rate limit') || haystack.includes('too many');
}

function isInvalidLink(error: AuthError): boolean {
  if (error.status === 401 || error.status === 403 || error.status === 422) {
    return true;
  }
  const haystack = `${error.code ?? ''} ${error.message}`.toLowerCase();
  return (
    haystack.includes('expired') ||
    haystack.includes('invalid') ||
    haystack.includes('session') ||
    haystack.includes('token')
  );
}

/**
 * Trigger a password-recovery email. Always resolves to the same generic
 * `sent` outcome whether or not the email maps to an account (AC 4), except
 * when Supabase reports rate limiting (AC 5) or an unexpected failure (AC 6).
 */
export async function requestPasswordReset(
  client: ResetRequestClient,
  rawEmail: string,
  appUrl: string,
): Promise<RequestResetOutcome> {
  const email = rawEmail.trim();
  const redirectTo = buildRedirectUrl(appUrl, RESET_CONFIRMATION_PATH);

  const { error } = await client.resetPasswordForEmail(email, { redirectTo });

  if (!error) {
    return 'sent';
  }

  if (isRateLimited(error)) {
    return 'rate_limited';
  }

  return 'error';
}

/**
 * Complete a password reset from an active recovery session. Validates the new
 * password at the boundary (AC 9) and maps auth failures to an invalid-link
 * outcome (AC 12/14) or a generic error (AC 6).
 */
export async function completePasswordReset(
  client: ResetCompletionClient,
  password: string,
  confirmation: string,
): Promise<CompleteResetResult> {
  const passwordCheck = validatePassword(password);
  const confirmationCheck = validatePasswordConfirmation(password, confirmation);

  if (!passwordCheck.valid || !confirmationCheck.valid) {
    return {
      outcome: 'invalid_input',
      fieldErrors: {
        password: passwordCheck.error,
        confirmation: confirmationCheck.error,
      },
    };
  }

  const { error } = await client.updateUser({ password });

  if (!error) {
    return { outcome: 'success' };
  }

  if (isInvalidLink(error)) {
    return { outcome: 'invalid_link' };
  }

  return { outcome: 'error' };
}

// Re-exported so callers can validate the email before hitting the service.
export { validateEmail };
