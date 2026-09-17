import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import LocaleSwitcher from "@/features/i18n/LocaleSwitcher";

const h = vi.hoisted(() => ({
  refresh: vi.fn(),
  setLocale: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ refresh: h.refresh }),
}));

vi.mock("@/features/i18n/actions", () => ({
  setLocale: (...args: unknown[]) => h.setLocale(...args),
}));

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    h.refresh.mockClear();
    h.setLocale.mockClear();
    h.setLocale.mockResolvedValue(undefined);
  });

  test("shows the current locale", () => {
    renderWithProviders(<LocaleSwitcher />);
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });

  test("lists both locale options when opened", () => {
    renderWithProviders(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
  });

  test("switches locale and refreshes on selection", async () => {
    renderWithProviders(<LocaleSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    fireEvent.click(screen.getByText("Español"));

    expect(h.setLocale).toHaveBeenCalledWith("es");
    await waitFor(() => expect(h.refresh).toHaveBeenCalled());
  });
});
