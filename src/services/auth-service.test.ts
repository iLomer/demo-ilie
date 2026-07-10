import { describe, expect, it } from "vitest";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getCurrentUser, getDisplayName, isAuthenticated } from "./auth-service";

function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as User;
}

function buildClient(user: User | null): SupabaseClient {
  return {
    auth: {
      getUser: async () => ({ data: { user }, error: null }),
    },
  } as unknown as SupabaseClient;
}

describe("getCurrentUser", () => {
  it("returns the user when a session exists", async () => {
    const user = buildUser();
    const result = await getCurrentUser(buildClient(user));
    expect(result).toBe(user);
  });

  it("returns null when there is no session", async () => {
    const result = await getCurrentUser(buildClient(null));
    expect(result).toBeNull();
  });
});

describe("isAuthenticated", () => {
  it("is true when a user exists", async () => {
    expect(await isAuthenticated(buildClient(buildUser()))).toBe(true);
  });

  it("is false when no user exists", async () => {
    expect(await isAuthenticated(buildClient(null))).toBe(false);
  });
});

describe("getDisplayName", () => {
  it("prefers the full name from user metadata", () => {
    const user = buildUser({
      email: "jane@example.com",
      user_metadata: { full_name: "Jane Doe" },
    });
    expect(getDisplayName(user)).toBe("Jane Doe");
  });

  it("trims whitespace from the full name", () => {
    const user = buildUser({ user_metadata: { full_name: "  Jane Doe  " } });
    expect(getDisplayName(user)).toBe("Jane Doe");
  });

  it("falls back to the email when no full name is set", () => {
    const user = buildUser({ email: "jane@example.com" });
    expect(getDisplayName(user)).toBe("jane@example.com");
  });

  it("falls back to a generic label when neither is present", () => {
    const user = buildUser({ email: undefined, user_metadata: {} });
    expect(getDisplayName(user)).toBe("there");
  });
});
