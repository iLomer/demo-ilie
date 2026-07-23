import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns a 200 status", () => {
    const response = GET();
    expect(response.status).toBe(200);
  });

  it("returns the expected payload shape", async () => {
    const response = GET();
    const body = await response.json();
    expect(body).toEqual({ status: "ok" });
  });
});
