import { describe, expect, it } from 'vitest';

import { buildRedirectUrl, isAllowedRedirect } from '@/services/redirect-allowlist';

const APP_URL = 'https://app.example.com';

describe('buildRedirectUrl', () => {
  it('anchors a relative path to the app origin', () => {
    expect(buildRedirectUrl(APP_URL, '/reset-password')).toBe(
      'https://app.example.com/reset-password',
    );
  });

  it('forces an absolute foreign URL back onto the app origin', () => {
    expect(buildRedirectUrl(APP_URL, 'https://evil.example.net/steal')).toBe(
      'https://app.example.com/steal',
    );
  });
});

describe('isAllowedRedirect', () => {
  it('allows a URL on the same origin', () => {
    expect(isAllowedRedirect(APP_URL, 'https://app.example.com/reset-password')).toBe(true);
  });

  it('rejects a URL on a different origin', () => {
    expect(isAllowedRedirect(APP_URL, 'https://evil.example.net/reset-password')).toBe(false);
  });

  it('rejects a non-absolute or malformed candidate', () => {
    expect(isAllowedRedirect(APP_URL, '/reset-password')).toBe(false);
    expect(isAllowedRedirect(APP_URL, 'not a url')).toBe(false);
  });
});
