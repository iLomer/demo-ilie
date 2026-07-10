import { signOut } from "@/app/actions/auth-actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit">Sign out</button>
    </form>
  );
}
