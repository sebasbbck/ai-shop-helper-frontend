import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import VerifyEmail from "@/features/auth/components/VerifyEmail";

const h = vi.hoisted(() => ({
  token: null as string | null,
  mutate: vi.fn(),
  isSuccess: false,
  isError: false,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(h.token ? { token: h.token } : {}),
}));

vi.mock("@/api/endpoints/auth/auth", () => ({
  useAuthVerifyEmail: () => ({
    mutate: h.mutate,
    isSuccess: h.isSuccess,
    isError: h.isError,
  }),
}));

describe("VerifyEmail", () => {
  beforeEach(() => {
    h.token = null;
    h.isSuccess = false;
    h.isError = false;
    h.mutate.mockClear();
  });

  test("shows an error and does not verify when no token is present", () => {
    h.token = null;

    renderWithProviders(<VerifyEmail />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(h.mutate).not.toHaveBeenCalled();
  });

  test("verifies the token taken from the URL", () => {
    h.token = "tok-123";

    renderWithProviders(<VerifyEmail />);

    expect(h.mutate).toHaveBeenCalledWith({ data: { token: "tok-123" } });
  });
});
