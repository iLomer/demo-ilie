import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { signInWithPassword, validateLoginInput } from "./auth-service";

describe("validateLoginInput", () => {
  it("accepts a well-formed email and password", () => {
    const result = validateLoginInput({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("trims surrounding whitespace before validating the email", () => {
    const result = validateLoginInput({
      email: "  user@example.com  ",
      password: "secret123",
    });
    expect(result.valid).toBe(true);
  });

  it("flags a missing email", () => {
    const result = validateLoginInput({ email: "", password: "secret123" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("flags a malformed email", () => {
    const result = validateLoginInput({ email: "not-an-email", password: "x" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("flags a missing password", () => {
    const result = validateLoginInput({
      email: "user@example.com",
      password: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });
});

describe("signInWithPassword", () => {
  it("does not call Supabase when input is invalid", async () => {
    const signIn = vi.fn();
    const client = {
      auth: { signInWithPassword: signIn },
    } as unknown as SupabaseClient;

    const result = await signInWithPassword(client, {
      email: "bad",
      password: "",
    });

    expect(result.success).toBe(false);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("returns success when Supabase authenticates the user", async () => {
    const signIn = vi.fn().mockResolvedValue({ error: null });
    const client = {
      auth: { signInWithPassword: signIn },
    } as unknown as SupabaseClient;

    const result = await signInWithPassword(client, {
      email: "user@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(true);
    expect(signIn).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret123",
    });
  });

  it("surfaces the Supabase error message on failure", async () => {
    const signIn = vi
      .fn()
      .mockResolvedValue({ error: { message: "Invalid login credentials" } });
    const client = {
      auth: { signInWithPassword: signIn },
    } as unknown as SupabaseClient;

    const result = await signInWithPassword(client, {
      email: "user@example.com",
      password: "wrong-password",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid login credentials");
  });
});
