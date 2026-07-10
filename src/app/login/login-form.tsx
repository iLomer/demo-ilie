"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginFormState } from "./actions";

const INITIAL_STATE: LoginFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, INITIAL_STATE);

  return (
    <form action={formAction} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error ? (
        <p role="alert" aria-live="polite">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
