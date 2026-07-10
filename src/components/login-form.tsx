"use client";

import { useState, useTransition } from "react";
import { signIn } from "@/app/actions/auth-actions";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required />

      {error ? <p role="alert">{error}</p> : null}

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
