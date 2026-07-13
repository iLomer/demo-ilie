/**
 * Boundary validation for the password-reset flow.
 *
 * These are pure functions with no I/O so they can be reused on the client
 * (inline form errors) and covered directly by unit tests.
 */

/** Agreed password policy for this story: minimum length. */
export const MIN_PASSWORD_LENGTH = 8;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const VALID: ValidationResult = { valid: true };

// Pragmatic email shape check: non-empty local part, single `@`, a dot in the
// domain, and no whitespace. Full RFC 5322 compliance is intentionally out of
// scope; the authoritative check is the delivery of the recovery email.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(rawEmail: string): ValidationResult {
  const email = rawEmail.trim();

  if (email.length === 0) {
    return { valid: false, error: 'Enter your email address.' };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }

  return VALID;
}

export function validatePassword(password: string): ValidationResult {
  if (password.length === 0) {
    return { valid: false, error: 'Enter a new password.' };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  return VALID;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): ValidationResult {
  if (confirmation.length === 0) {
    return { valid: false, error: 'Re-enter your new password.' };
  }

  if (password !== confirmation) {
    return { valid: false, error: 'Passwords do not match.' };
  }

  return VALID;
}
