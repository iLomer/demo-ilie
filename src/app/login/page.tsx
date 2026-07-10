import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in — demo-ilie",
};

export default function LoginPage() {
  return (
    <main>
      <h1>Log in</h1>
      <p>Enter your credentials to access your account.</p>
      <LoginForm />
    </main>
  );
}
