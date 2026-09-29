import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import AuthGate from "@/features/auth/components/AuthGate";

type User = { id: string; email: string };

const user: User = { id: "u1", email: "user@example.com" };

const h = vi.hoisted(() => ({
  replace: vi.fn(),
  ensureAccessToken: vi.fn(),
  user: undefined as { id: string; email: string } | undefined,
  isError: false,
  queryOptions: undefined as unknown,
}));

vi.mock("next/navigation", () => {
  let router: ReturnType<typeof makeRouter> | undefined;
  return { useRouter: () => (router ??= makeRouter({ replace: h.replace })) };
});

vi.mock("@/lib/api/custom-instance", () => ({
  ensureAccessToken: h.ensureAccessToken,
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetMe: (options: unknown) => {
    h.queryOptions = options;
    return { data: h.user, isError: h.isError };
  },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function renderGate() {
  return renderWithProviders(
    <AuthGate>
      <div data-testid="protected-content" />
    </AuthGate>,
  );
}

const spinner = () => screen.queryByRole("progressbar");
const content = () => screen.queryByTestId("protected-content");
const queryEnabled = () =>
  (h.queryOptions as { query: { enabled: boolean } }).query.enabled;

beforeEach(() => {
  h.replace.mockClear();
  h.ensureAccessToken.mockReset();
  h.user = undefined;
  h.isError = false;
  h.queryOptions = undefined;
});

describe("AuthGate", () => {
  test("shows a spinner and keeps the query disabled while the token is resolving", () => {
    h.ensureAccessToken.mockReturnValue(deferred<string | null>().promise);
    renderGate();

    expect(spinner()).toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
    expect(queryEnabled()).toBe(false);
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("enables the query without retries once a token is available", async () => {
    h.ensureAccessToken.mockResolvedValue("token-123");
    renderGate();

    await waitFor(() => expect(queryEnabled()).toBe(true));
    expect(h.queryOptions).toEqual({ query: { enabled: true, retry: false } });
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("keeps showing the spinner while the user request is in flight", async () => {
    h.ensureAccessToken.mockResolvedValue("token-123");
    renderGate();

    await waitFor(() => expect(queryEnabled()).toBe(true));
    expect(spinner()).toBeInTheDocument();
    expect(content()).not.toBeInTheDocument();
  });

  test("renders the children once the token and the user are both there", async () => {
    h.ensureAccessToken.mockResolvedValue("token-123");
    h.user = user;
    renderGate();

    expect(await screen.findByTestId("protected-content")).toBeInTheDocument();
    expect(spinner()).not.toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("redirects to the login page when there is no token", async () => {
    h.ensureAccessToken.mockResolvedValue(null);
    renderGate();

    await waitFor(() => expect(h.replace).toHaveBeenCalledWith("/login"));
    expect(h.replace).toHaveBeenCalledTimes(1);
    expect(queryEnabled()).toBe(false);
    expect(content()).not.toBeInTheDocument();
  });

  test("redirects to the login page when the user request fails", async () => {
    h.ensureAccessToken.mockResolvedValue("token-123");
    h.isError = true;
    renderGate();

    await waitFor(() => expect(h.replace).toHaveBeenCalledWith("/login"));
    expect(content()).not.toBeInTheDocument();
  });

  test("ignores a token that arrives after the gate unmounted", async () => {
    const token = deferred<string | null>();
    h.ensureAccessToken.mockReturnValue(token.promise);
    const { unmount } = renderGate();

    unmount();
    await act(async () => {
      token.resolve("token-123");
    });

    expect(h.replace).not.toHaveBeenCalled();
  });

  test("ignores a missing token that arrives after the gate unmounted", async () => {
    const token = deferred<string | null>();
    h.ensureAccessToken.mockReturnValue(token.promise);
    const { unmount } = renderGate();

    unmount();
    await act(async () => {
      token.resolve(null);
    });

    expect(h.replace).not.toHaveBeenCalled();
  });

  test("asks for the token exactly once per mount", async () => {
    h.ensureAccessToken.mockResolvedValue("token-123");
    h.user = user;
    renderGate();

    await screen.findByTestId("protected-content");

    expect(h.ensureAccessToken).toHaveBeenCalledTimes(1);
  });

  test("centers the spinner in a padded row", () => {
    h.ensureAccessToken.mockReturnValue(deferred<string | null>().promise);
    const { container } = renderGate();

    expect(container.firstElementChild).toHaveStyle({
      display: "flex",
      justifyContent: "center",
    });
  });
});
