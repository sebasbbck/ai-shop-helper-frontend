import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import UsersAdmin from "@/features/admin/UsersAdmin";
import type { UserPublic } from "@/api/model/userPublic";

type UsersQueryState = {
  data?: { items: UserPublic[]; total: number };
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
};

const h = vi.hoisted(() => ({
  state: {} as UsersQueryState,
  getUsers: vi.fn(),
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetUsers: (params: unknown, options: unknown) => {
    h.getUsers(params, options);
    return h.state;
  },
}));

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

beforeEach(() => {
  h.getUsers.mockClear();
  h.state = { isLoading: false, isError: false, isPlaceholderData: false };
});

describe("UsersAdmin", () => {
  test("requests the first page on mount", () => {
    h.state = {
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);

    expect(h.getUsers).toHaveBeenCalledWith(
      { offset: 0, limit: 25 },
      expect.anything(),
    );
  });

  test("shows the empty state when there are no users", () => {
    h.state = {
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  test("shows the error state when the query fails", () => {
    h.state = {
      data: undefined,
      isLoading: false,
      isError: true,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);

    expect(screen.getByText("Could not load users")).toBeInTheDocument();
  });

  test("renders users with role and status", () => {
    h.state = {
      data: {
        items: [
          makeUser({ id: "u1", name: "Ada Lovelace", is_superuser: true }),
          makeUser({
            id: "u2",
            name: "Bob Regular",
            email: "bob@example.com",
            is_active: false,
            is_superuser: false,
          }),
        ],
        total: 2,
      },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Superuser")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  test("copies an email to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    h.state = {
      data: { items: [makeUser({ email: "ada@example.com" })], total: 1 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));

    expect(writeText).toHaveBeenCalledWith("ada@example.com");
  });

  test("advances the offset when paging forward", () => {
    h.state = {
      data: { items: [makeUser({})], total: 60 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };

    renderWithProviders(<UsersAdmin />);
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(h.getUsers).toHaveBeenLastCalledWith(
      { offset: 25, limit: 25 },
      expect.anything(),
    );
  });

  test("shows skeleton rows while loading", () => {
    h.state = {
      data: undefined,
      isLoading: true,
      isError: false,
      isPlaceholderData: false,
    };

    const { container } = renderWithProviders(<UsersAdmin />);

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
  });
});
