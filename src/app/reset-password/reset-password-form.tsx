'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import {
  completePasswordReset,
  type CompleteResetResult,
} from '@/services/password-reset-service';

type LinkState = 'checking' | 'ready' | 'invalid';
type SubmitState = 'idle' | 'submitting' | 'success';

export function ResetPasswordForm() {
  const router = useRouter();
  const [linkState, setLinkState] = useState<LinkState>('checking');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] =
    useState<CompleteResetResult['fieldErrors']>(undefined);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) {
        return;
      }
      if (event === 'PASSWORD_RECOVERY' || session) {
        setLinkState('ready');
      }
    });

    // The browser client processes the recovery token from the URL on load;
    // if no recovery session is established the link is invalid/expired.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      setLinkState((current) =>
        data.session ? 'ready' : current === 'ready' ? 'ready' : 'invalid',
      );
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors(undefined);
    setSubmitState('submitting');

    try {
      const supabase = createSupabaseBrowserClient();
      const result = await completePasswordReset(supabase.auth, password, confirmation);

      if (result.outcome === 'invalid_input') {
        setFieldErrors(result.fieldErrors);
        setSubmitState('idle');
        return;
      }

      if (result.outcome === 'invalid_link') {
        setLinkState('invalid');
        return;
      }

      if (result.outcome === 'error') {
        setFormError('Something went wrong. Please try again.');
        setSubmitState('idle');
        return;
      }

      setSubmitState('success');
      router.push('/sign-in');
    } catch {
      setFormError('Something went wrong. Please try again.');
      setSubmitState('idle');
    }
  }

  if (linkState === 'checking') {
    return (
      <p role="status" aria-live="polite">
        Checking your reset link…
      </p>
    );
  }

  if (linkState === 'invalid') {
    return (
      <div>
        <p role="alert">
          This password reset link is no longer valid. It may have expired or
          already been used.
        </p>
        <p>
          <Link href="/forgot-password">Request a new reset link</Link>
        </p>
      </div>
    );
  }

  if (submitState === 'success') {
    return (
      <p role="status" aria-live="polite">
        Your password has been updated. Redirecting you to sign in…
      </p>
    );
  }

  const isSubmitting = submitState === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={fieldErrors?.password ? true : undefined}
          aria-describedby={fieldErrors?.password ? 'new-password-error' : undefined}
          disabled={isSubmitting}
        />
        {fieldErrors?.password ? (
          <p id="new-password-error" role="alert">
            {fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          aria-invalid={fieldErrors?.confirmation ? true : undefined}
          aria-describedby={
            fieldErrors?.confirmation ? 'confirm-password-error' : undefined
          }
          disabled={isSubmitting}
        />
        {fieldErrors?.confirmation ? (
          <p id="confirm-password-error" role="alert">
            {fieldErrors.confirmation}
          </p>
        ) : null}
      </div>

      {formError ? <p role="alert">{formError}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
