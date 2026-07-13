import Link from 'next/link';

/**
 * Minimal sign-in entry point. A full sign-in implementation is out of scope
 * for this story; what matters here is the "Forgot password?" entry point that
 * navigates to the dedicated request page (AC 1).
 */
export default function SignInPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <p>
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
    </main>
  );
}
