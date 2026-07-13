'use client';

import { useState, type FormEvent } from 'react';

import { getConfig } from '@/config';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { validateEmail } from '@/services/password-validation';
import { requestPasswordReset } from '@/services/password-reset-service';

type Status = 'idle' | 'submitting' | 'done' | 'rate_limited' | 'error';

const GENERIC_CONFIRMATION =
  'If an account exists for that email, a reset link has been sent.';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const check = validateEmail(email);
    if (!check.valid) {
      setEmailError(check.error ?? 'Enter a valid email address.');
      return;
    }

    setEmailError(null);
    setStatus('submitting');

    try {
      const supabase = createSupabaseBrowserClient();
      const outcome = await requestPasswordReset(
        supabase.auth,
        email,
        getConfig().appUrl,
      );

      if (outcome === 'rate_limited') {
        setStatus('rate_limited');
        return;
      }

      if (outcome === 'error') {
        setStatus('error');
        return;
      }

      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p role="status" aria-live="polite">
        {GENERIC_CONFIRMATION}
      </p>
    );
  }

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        {emailError ? (
          <p id="email-error" role="alert">
            {emailError}
          </p>
        ) : null}
      </div>

      {status === 'rate_limited' ? (
        <p role="status" aria-live="polite">
          You&apos;ve requested this too many times. Please wait a little while and
          try again later.
        </p>
      ) : null}

      {status === 'error' ? (
        <p role="alert">
          Something went wrong while sending your reset link. Please try again.
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
