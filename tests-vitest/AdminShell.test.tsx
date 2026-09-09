import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import AdminShell from "@/features/admin/AdminShell";

const h = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: h.push, replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/features/i18n/LocaleSwitcher", () => ({
  default: () => <div data-testid="locale-switcher" />,
}));

vi.mock("@/components/layout/UserMenu", () => ({
  default: () => <div data-testid="user-menu" />,
}));

beforeEach(() => {
  h.push.mockClear();
});

describe("AdminShell", () => {
  test("renders the admin chrome and children", () => {
    renderWithProviders(
      <AdminShell>
        <p>Panel content</p>
      </AdminShell>,
    );

    expect(screen.getByText("Panel content")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  test("navigates back to the app", () => {
    renderWithProviders(
      <AdminShell>
        <p>Panel content</p>
      </AdminShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to app" }));

    expect(h.push).toHaveBeenCalledWith("/");
  });
});
