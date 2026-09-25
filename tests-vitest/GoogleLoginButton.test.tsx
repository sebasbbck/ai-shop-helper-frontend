import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import GoogleLoginButton from "@/features/auth/components/GoogleLoginButton";

const h = vi.hoisted(() => ({ googleLoginWithGoogle: vi.fn() }));

// Only useTranslations is replaced; NextIntlClientProvider and the rest of the
// module are kept so the app's own providers keep working.
vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/api/endpoints/google/google", () => ({
  googleLoginWithGoogle: h.googleLoginWithGoogle,
}));

/** A promise whose resolution this test controls. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const button = () => screen.getByRole("button");
const alert = () => screen.queryByRole("alert");

beforeEach(() => {
  h.googleLoginWithGoogle.mockReset();
  // window.location is read-only in jsdom, so it is swapped for a plain object
  // whose href assignment the test can observe.
  vi.stubGlobal("location", { href: "http://localhost/login" });
});

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
});

describe("GoogleLoginButton", () => {
  test("renders an enabled button with the Google icon and no error", () => {
    renderWithProviders(<GoogleLoginButton />);

    expect(button()).toHaveTextContent("continueWithGoogle");
    expect(button()).toBeEnabled();
    expect(button().querySelector("svg")).not.toBeNull();
    expect(alert()).not.toBeInTheDocument();
  });

  test("disables the button and swaps the label while the request is in flight", async () => {
    const pending = deferred<{ auth_url: string }>();
    h.googleLoginWithGoogle.mockReturnValue(pending.promise);
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());

    await waitFor(() => expect(button()).toBeDisabled());
    expect(button()).toHaveTextContent("connectingGoogle");

    await act(async () => {
      pending.resolve({
        auth_url: "https://accounts.google.com/o/oauth2/auth",
      });
    });
  });

  test("sends the browser to the returned authorization URL", async () => {
    h.googleLoginWithGoogle.mockResolvedValue({
      auth_url: "https://accounts.google.com/o/oauth2/auth?client_id=abc",
    });
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());

    await waitFor(() =>
      expect(window.location.href).toBe(
        "https://accounts.google.com/o/oauth2/auth?client_id=abc",
      ),
    );
    expect(h.googleLoginWithGoogle).toHaveBeenCalledTimes(1);
  });

  test("keeps the button disabled after a successful request", async () => {
    h.googleLoginWithGoogle.mockResolvedValue({
      auth_url: "https://accounts.google.com",
    });
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());

    // The redirect is under way, so the button must not invite a second click.
    await waitFor(() =>
      expect(window.location.href).toBe("https://accounts.google.com"),
    );
    expect(button()).toBeDisabled();
    expect(alert()).not.toBeInTheDocument();
  });

  test("shows an error and re-enables the button when the request fails", async () => {
    h.googleLoginWithGoogle.mockRejectedValue(new Error("network down"));
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());

    expect(await screen.findByRole("alert")).toHaveTextContent("googleError");
    expect(button()).toBeEnabled();
    expect(button()).toHaveTextContent("continueWithGoogle");
  });

  test("does not navigate when the request fails", async () => {
    h.googleLoginWithGoogle.mockRejectedValue(new Error("network down"));
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());

    await screen.findByRole("alert");
    expect(window.location.href).toBe("http://localhost/login");
  });

  test("clears the previous error when the user tries again", async () => {
    h.googleLoginWithGoogle.mockRejectedValueOnce(new Error("network down"));
    h.googleLoginWithGoogle.mockResolvedValueOnce({
      auth_url: "https://accounts.google.com",
    });
    renderWithProviders(<GoogleLoginButton />);

    fireEvent.click(button());
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    fireEvent.click(button());

    await waitFor(() => expect(alert()).not.toBeInTheDocument());
    expect(window.location.href).toBe("https://accounts.google.com");
    expect(h.googleLoginWithGoogle).toHaveBeenCalledTimes(2);
  });
});
