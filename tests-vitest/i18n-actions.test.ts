import { beforeEach, describe, expect, test, vi } from "vitest";
import { setLocale } from "@/features/i18n/actions";

const h = vi.hoisted(() => ({
  set: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: h.set }),
}));

describe("setLocale", () => {
  beforeEach(() => {
    h.set.mockClear();
  });

  test("sets the locale cookie for a supported locale", async () => {
    await setLocale("es");
    expect(h.set).toHaveBeenCalledWith("NEXT_LOCALE", "es", { path: "/" });
  });

  test("ignores unsupported locales", async () => {
    await setLocale("fr");
    expect(h.set).not.toHaveBeenCalled();
  });
});
