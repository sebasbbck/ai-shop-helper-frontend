import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function makeRequest(pathname: string, cookie?: string): NextRequest {
  return new NextRequest(new URL(pathname, "http://localhost:3000"), {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("proxy", () => {
  test("redirects to /login when there is no session on a protected route", () => {
    const res = proxy(makeRequest("/dashboard"));

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login");
  });

  test("allows a public route through without a session", () => {
    const res = proxy(makeRequest("/login"));

    expect(res.headers.get("location")).toBeNull();
  });

  test("allows nested public routes through without a session", () => {
    const res = proxy(makeRequest("/reset-password/abc123"));

    expect(res.headers.get("location")).toBeNull();
  });

  test("allows a protected route through when a session cookie is present", () => {
    const res = proxy(makeRequest("/dashboard", "refresh_token=abc"));

    expect(res.headers.get("location")).toBeNull();
  });
});
