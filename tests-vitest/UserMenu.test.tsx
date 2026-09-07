import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import UserMenu from "@/components/layout/UserMenu";
import type { UserPublic } from "@/api/model/userPublic";

const h = vi.hoisted(() => ({
  user: undefined as UserPublic | undefined,
  push: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: h.push, replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetMe: () => ({ data: h.user }),
}));

vi.mock("@/api/endpoints/auth/auth", () => ({
  useAuthLogout: () => ({ mutate: h.logout, isPending: false }),
}));

vi.mock("@/lib/api/token-store", () => ({ setAccessToken: vi.fn() }));

function makeUser(overrides: Partial<UserPublic>): UserPublic {
  return {
    id: "u1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    is_active: true,
    is_superuser: false,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    ...overrides,
  };
}

function openMenu() {
  fireEvent.click(screen.getByRole("button", { name: "User menu" }));
}

beforeEach(() => {
  h.push.mockClear();
  h.logout.mockClear();
});

describe("UserMenu admin link", () => {
  test("shows the admin item for superusers and navigates to /admin", () => {
    h.user = makeUser({ is_superuser: true });

    renderWithProviders(<UserMenu />);
    openMenu();

    const adminItem = screen.getByText("Admin");
    fireEvent.click(adminItem);

    expect(h.push).toHaveBeenCalledWith("/admin");
  });

  test("hides the admin item for regular users", () => {
    h.user = makeUser({ is_superuser: false });

    renderWithProviders(<UserMenu />);
    openMenu();

    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});
