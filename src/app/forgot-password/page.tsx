import { ForgotPasswordForm } from '@/app/forgot-password/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main>
      <h1>Reset your password</h1>
      <p>Enter your email and we&apos;ll send you a link to reset your password.</p>
      <ForgotPasswordForm />
    </main>
  );
}
