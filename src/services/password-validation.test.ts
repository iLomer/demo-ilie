import { describe, expect, it } from 'vitest';

import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/services/password-validation';

describe('validateEmail', () => {
  it('rejects an empty email', () => {
    expect(validateEmail('   ').valid).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(validateEmail('not-an-email').valid).toBe(false);
    expect(validateEmail('missing@domain').valid).toBe(false);
    expect(validateEmail('a b@example.com').valid).toBe(false);
  });

  it('accepts a well-formed email and ignores surrounding whitespace', () => {
    expect(validateEmail('  user@example.com  ')).toEqual({ valid: true });
  });
});

describe('validatePassword', () => {
  it('rejects an empty password', () => {
    expect(validatePassword('').valid).toBe(false);
  });

  it(`rejects passwords shorter than ${MIN_PASSWORD_LENGTH} characters`, () => {
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH - 1)).valid).toBe(false);
  });

  it('accepts a password that meets the minimum length', () => {
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH))).toEqual({ valid: true });
  });
});

describe('validatePasswordConfirmation', () => {
  it('rejects an empty confirmation', () => {
    expect(validatePasswordConfirmation('supersecret', '').valid).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    expect(validatePasswordConfirmation('supersecret', 'different!!').valid).toBe(false);
  });

  it('accepts matching passwords', () => {
    expect(validatePasswordConfirmation('supersecret', 'supersecret')).toEqual({ valid: true });
  });
});
