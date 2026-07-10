import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getDisplayName } from "@/services/auth-service";
import { SignOutButton } from "@/components/sign-out-button";

/**
 * Homepage. Reachable only once the user is logged in — middleware guards
 * the route, and this server component re-checks as a defense in depth.
 */
export default async function HomePage() {
  const supabase = createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Welcome, {getDisplayName(user)}</h1>
      <p>You are logged in. This is your homepage.</p>
      <SignOutButton />
    </main>
  );
}
