import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeListQueryState, type ListQueryState } from "./mocks/query-state";
import { makeUser } from "./mocks/entities";
import UsersAdmin from "@/features/admin/UsersAdmin";
import type { UserPublic } from "@/api/model/userPublic";

const h = vi.hoisted(() => ({
  state: {} as ListQueryState<UserPublic>,
  getUsers: vi.fn(),
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetUsers: (params: unknown, options: unknown) => {
    h.getUsers(params, options);
    return h.state;
  },
}));

beforeEach(() => {
  h.getUsers.mockClear();
  h.state = makeListQueryState();
});

describe("UsersAdmin", () => {
  test("requests the first page on mount", () => {
    h.state = makeListQueryState({ data: { items: [], total: 0 } });

    renderWithProviders(<UsersAdmin />);

    expect(h.getUsers).toHaveBeenCalledWith(
      { offset: 0, limit: 25 },
      expect.anything(),
    );
  });

  test("shows the empty state when there are no users", () => {
    h.state = makeListQueryState({ data: { items: [], total: 0 } });

    renderWithProviders(<UsersAdmin />);

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  test("shows the error state when the query fails", () => {
    h.state = makeListQueryState({ isError: true });

    renderWithProviders(<UsersAdmin />);

    expect(screen.getByText("Could not load users")).toBeInTheDocument();
  });

  test("renders users with role and status", () => {
    h.state = makeListQueryState({
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
    });

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
    h.state = makeListQueryState({
      data: { items: [makeUser({ email: "ada@example.com" })], total: 1 },
    });

    renderWithProviders(<UsersAdmin />);
    fireEvent.click(screen.getByRole("button", { name: "Copy email" }));

    expect(writeText).toHaveBeenCalledWith("ada@example.com");
  });

  test("advances the offset when paging forward", () => {
    h.state = makeListQueryState({
      data: { items: [makeUser({})], total: 60 },
    });

    renderWithProviders(<UsersAdmin />);
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));

    expect(h.getUsers).toHaveBeenLastCalledWith(
      { offset: 25, limit: 25 },
      expect.anything(),
    );
  });

  test("shows skeleton rows while loading", () => {
    h.state = makeListQueryState({ isLoading: true });

    const { container } = renderWithProviders(<UsersAdmin />);

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
  });
});
