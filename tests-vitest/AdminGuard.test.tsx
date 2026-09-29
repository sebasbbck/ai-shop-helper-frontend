import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import AdminGuard from "@/features/auth/components/AdminGuard";

type User = { id: string; email: string; is_superuser: boolean };

const admin: User = {
  id: "u1",
  email: "admin@example.com",
  is_superuser: true,
};
const member: User = {
  id: "u2",
  email: "member@example.com",
  is_superuser: false,
};

const h = vi.hoisted(() => ({
  replace: vi.fn(),
  user: undefined as
    { id: string; email: string; is_superuser: boolean } | undefined,
  isLoading: false,
  queryOptions: undefined as unknown,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ replace: h.replace }),
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetMe: (options: unknown) => {
    h.queryOptions = options;
    return { data: h.user, isLoading: h.isLoading };
  },
}));

function renderGuard() {
  return renderWithProviders(
    <AdminGuard>
      <div data-testid="admin-content" />
    </AdminGuard>,
  );
}

const spinner = () => screen.queryByRole("progressbar");
const content = () => screen.queryByTestId("admin-content");

beforeEach(() => {
  h.replace.mockClear();
  h.user = undefined;
  h.isLoading = false;
  h.queryOptions = undefined;
});

describe("AdminGuard", () => {
  test("shows a spinner while the current user is loading", () => {
    h.isLoading = true;
    renderGuard();

    expect(spinner()).toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("renders the children for a superuser", () => {
    h.user = admin;
    renderGuard();

    expect(content()).toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("redirects a signed-in user who is not a superuser", () => {
    h.user = member;
    renderGuard();

    expect(h.replace).toHaveBeenCalledTimes(1);
    expect(h.replace).toHaveBeenCalledWith("/");
  });

  test("never leaks the children to a user who is not a superuser", () => {
    h.user = member;
    renderGuard();

    expect(content()).not.toBeInTheDocument();
    expect(spinner()).toBeInTheDocument();
  });

  test("shows a spinner and stays put when there is no user at all", () => {
    renderGuard();

    expect(spinner()).toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("asks the API not to retry the current-user request", () => {
    renderGuard();

    expect(h.queryOptions).toEqual({ query: { retry: false } });
  });

  test("centers the spinner in a padded row", () => {
    const { container } = renderGuard();

    expect(container.firstElementChild).toHaveStyle({
      display: "flex",
      justifyContent: "center",
    });
  });
});
