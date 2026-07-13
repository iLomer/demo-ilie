import { describe, expect, it, vi } from 'vitest';

import {
  completePasswordReset,
  requestPasswordReset,
  RESET_CONFIRMATION_PATH,
  type ResetCompletionClient,
  type ResetRequestClient,
} from '@/services/password-reset-service';

const APP_URL = 'https://app.example.com';

describe('requestPasswordReset', () => {
  it('passes a redirectTo anchored to the app origin and returns "sent" on success', async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
    const client: ResetRequestClient = { resetPasswordForEmail };

    const outcome = await requestPasswordReset(client, '  user@example.com ', APP_URL);

    expect(outcome).toBe('sent');
    expect(resetPasswordForEmail).toHaveBeenCalledWith('user@example.com', {
      redirectTo: `${APP_URL}${RESET_CONFIRMATION_PATH}`,
    });
  });

  it('returns "sent" even when the account does not exist (no enumeration)', async () => {
    const client: ResetRequestClient = {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    };

    expect(await requestPasswordReset(client, 'ghost@example.com', APP_URL)).toBe('sent');
  });

  it('returns "rate_limited" when Supabase reports a 429', async () => {
    const client: ResetRequestClient = {
      resetPasswordForEmail: vi
        .fn()
        .mockResolvedValue({ error: { message: 'Too many requests', status: 429 } }),
    };

    expect(await requestPasswordReset(client, 'user@example.com', APP_URL)).toBe('rate_limited');
  });

  it('returns "error" on an unexpected failure', async () => {
    const client: ResetRequestClient = {
      resetPasswordForEmail: vi
        .fn()
        .mockResolvedValue({ error: { message: 'Service unavailable', status: 500 } }),
    };

    expect(await requestPasswordReset(client, 'user@example.com', APP_URL)).toBe('error');
  });
});

describe('completePasswordReset', () => {
  const okClient: ResetCompletionClient = {
    updateUser: vi.fn().mockResolvedValue({ error: null }),
  };

  it('blocks submission for a password that is too short', async () => {
    const result = await completePasswordReset(okClient, 'short', 'short');

    expect(result.outcome).toBe('invalid_input');
    expect(result.fieldErrors?.password).toBeDefined();
  });

  it('blocks submission when the confirmation does not match', async () => {
    const result = await completePasswordReset(okClient, 'longenough1', 'different1');

    expect(result.outcome).toBe('invalid_input');
    expect(result.fieldErrors?.confirmation).toBeDefined();
  });

  it('updates the password and returns "success" for valid input', async () => {
    const updateUser = vi.fn().mockResolvedValue({ error: null });
    const client: ResetCompletionClient = { updateUser };

    const result = await completePasswordReset(client, 'longenough1', 'longenough1');

    expect(result.outcome).toBe('success');
    expect(updateUser).toHaveBeenCalledWith({ password: 'longenough1' });
  });

  it('returns "invalid_link" when the recovery session is expired or missing', async () => {
    const client: ResetCompletionClient = {
      updateUser: vi
        .fn()
        .mockResolvedValue({ error: { message: 'Auth session missing', status: 401 } }),
    };

    const result = await completePasswordReset(client, 'longenough1', 'longenough1');

    expect(result.outcome).toBe('invalid_link');
  });

  it('returns "error" on an unexpected failure', async () => {
    const client: ResetCompletionClient = {
      updateUser: vi.fn().mockResolvedValue({ error: { message: 'boom', status: 500 } }),
    };

    const result = await completePasswordReset(client, 'longenough1', 'longenough1');

    expect(result.outcome).toBe('error');
  });
});
