import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/services/auth-service";
import { LoginForm } from "@/components/login-form";

/**
 * Login page. Authenticated users are sent straight to the homepage so they
 * never see the login form once logged in.
 */
export default async function LoginPage() {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);

  if (user) {
    redirect("/");
  }

  return (
    <main>
      <h1>Sign in</h1>
      <LoginForm />
    </main>
  );
}
