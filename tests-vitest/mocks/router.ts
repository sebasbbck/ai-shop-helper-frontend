import { vi } from "vitest";

/**
 * Shared shape for `next/navigation`'s `useRouter()` mock. Pass the specific
 * fn(s) a test wants to assert on (usually one of push/replace) and the rest
 * fall back to no-op mocks, e.g.:
 *
 *   vi.mock("next/navigation", () => ({
 *     useRouter: () => makeRouter({ push: h.push }),
 *   }));
 */
export function makeRouter(
  overrides: Partial<{
    push: ReturnType<typeof vi.fn>;
    replace: ReturnType<typeof vi.fn>;
    prefetch: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  }> = {},
) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
    ...overrides,
  };
}
